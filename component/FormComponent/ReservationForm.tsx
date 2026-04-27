"use client";
import createReservations from "@/libs/reservation/createReservation";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FormComponent from "./FormComponent";
import SuccessModal from "../ReservationManagement/ReservationSuccess";
import { ShopItem } from "@/interface";
import SubmitButton from "../ui/SubmitButton";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function ReservationForm({ shop }: { shop: ShopItem }) {
  const { data: session } = useSession();
  const [time, setTime] = useState<Dayjs | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [massageType, setMassageType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // --- 1. Logic สำหรับกำหนดขอบเขตเวลา (วางไว้ตรงนี้เพื่อให้เข้าถึงได้ทั้งไฟล์) ---
  const minSelectableTime = dayjs().add(1, "hour");

  // แปลงเวลาเปิด-ปิดร้านจาก String เป็น Dayjs (อ้างอิงวันที่ที่เลือก)
  const shopOpen = date
    ? date.hour(parseInt(shop.openClose.open.split(":")[0])).minute(parseInt(shop.openClose.open.split(":")[1])).second(0)
    : dayjs(shop.openClose.open, "HH:mm");

  const shopClose = date
    ? date.hour(parseInt(shop.openClose.close.split(":")[0])).minute(parseInt(shop.openClose.close.split(":")[1])).second(0)
    : dayjs(shop.openClose.close, "HH:mm");

  // จุดเริ่มต้นที่เลือกได้: ถ้าเป็นวันนี้ ต้องห่างอย่างน้อย 1 ชม. และไม่ก่อนร้านเปิด
  const actualMinTime = date?.isSame(dayjs(), "day")
    ? minSelectableTime.isAfter(shopOpen)
      ? minSelectableTime
      : shopOpen
    : shopOpen;

  const handleTreatmentChange = (typeName: string) => {
    setMassageType(typeName);
    setValidationError("");
  };

  const fieldStyle = {
    bgcolor: "var(--card-bg)",
    borderRadius: "1rem",
    color: "var(--text-main)",
    transition: "all 0.3s ease",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--card-border)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent)" },
    "& .MuiInputBase-input": {
      fontSize: "0.7rem",
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      padding: "12px 16px",
      color: "var(--text-main)",
    },
    "& .MuiSvgIcon-root": { color: "var(--accent)" },
  };

  const pickerStyle = {
    "& .MuiPaper-root": {
      bgcolor: "var(--card-bg)",
      color: "var(--text-main)",
      border: "1px solid var(--card-border)",
      backdropFilter: "blur(12px)",
      borderRadius: "1.5rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      "& .MuiPickersDay-root": {
        color: "var(--text-main)",
        fontSize: "0.75rem",
        "&:hover": { bgcolor: "rgba(212, 175, 55, 0.1)" },
        "&.Mui-selected": { bgcolor: "var(--accent) !important", color: "#fff" },
      },
      "& .MuiClock-pin, & .MuiClockPointer-root": { bgcolor: "var(--accent)" },
      "& .MuiClockPointer-thumb": { borderColor: "var(--accent)", bgcolor: "var(--accent)" },
      "& .MuiMultiSectionDigitalClockSection-item.Mui-selected": { bgcolor: "var(--accent) !important" },
    },
  };

  async function handleCreateReservation() {
    setValidationError("");
    if (!massageType || !date || !time) {
      setValidationError("Kindly complete all fields to proceed.");
      return;
    }
    if (!session) return;

    const selectedTreatment = shop.massageType.find((t) => t.name === massageType);
    if (!selectedTreatment) return;

    const activePromo = selectedTreatment.promotions?.find((p) => p.isActive);
    const finalPrice = activePromo
      ? selectedTreatment.price - activePromo.discountPrice
      : selectedTreatment.price;

    const selectedDateTime = date.hour(time.hour()).minute(time.minute());

    // เช็คเงื่อนไขเวลาอีกครั้งก่อนส่งไป Backend
    if (selectedDateTime.isBefore(actualMinTime) || selectedDateTime.isAfter(shopClose)) {
      setValidationError(
        `Please select a time between ${actualMinTime.format("HH:mm")} and ${shop.openClose.close}`
      );
      return;
    }

    try {
      await createReservations(
        session?.user.token,
        session?.user.name,
        selectedDateTime.toISOString(),
        shop._id,
        massageType,
        finalPrice
      );
      setIsModalOpen(true);
    } catch (err: any) {
      setValidationError(err.message || "A disturbance in the connection. Please try again.");
    }
  }

  return (
    <>
      <FormComponent handleSubmit={(e) => { e.preventDefault(); handleCreateReservation(); }}>
        <div className="flex flex-col gap-8 w-full">
          {/* Service Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-4 bg-accent/40" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">Select Service</p>
            </div>
            <FormControl fullWidth size="small">
              <Select
                value={massageType}
                onChange={(e) => handleTreatmentChange(e.target.value)}
                displayEmpty
                sx={fieldStyle}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "var(--card-bg)",
                      backgroundImage: "none",
                      border: "1px solid var(--card-border)",
                      borderRadius: "1rem",
                      marginTop: "8px",
                      "& .MuiMenuItem-root": {
                        color: "var(--text-main)",
                        "&:hover": { bgcolor: "rgba(212, 175, 55, 0.08)" },
                        "&.Mui-selected": { bgcolor: "rgba(212, 175, 55, 0.15)", color: "var(--gold)" },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <span className="text-text-sub text-[10px] uppercase tracking-widest opacity-50">Select your treatment</span>
                </MenuItem>
                {shop.massageType.filter((type) => type.isActive).map((type) => {
                  const activePromo = type.promotions?.find((p) => p.isActive);
                  const hasDiscount = activePromo && activePromo.discountPrice > 0;
                  const currentPrice = hasDiscount ? type.price - activePromo.discountPrice : type.price;
                  return (
                    <MenuItem key={type._id} value={type.name} sx={{ py: 1.5 }}>
                      <div className="flex justify-between w-full text-[10px] uppercase tracking-[0.15em] font-medium items-center">
                        <div className="flex flex-col">
                          <span className="text-text-main">{type.name}</span>
                          {hasDiscount && <span className="text-[8px] text-accent font-bold italic tracking-tight">✦ {activePromo.title}</span>}
                        </div>
                        <div className="flex flex-col items-end">
                          {hasDiscount && <span className="text-[8px] text-red-500/50 line-through mb-0.5">฿{type.price}</span>}
                          <span className="text-accent font-bold">฿{currentPrice}</span>
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

          {/* Schedule Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-4 bg-accent/40" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold">Inscribe Time</p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  disablePast
                  onChange={(newValue) => { setDate(newValue); setTime(null); }} // รีเซ็ตเวลาถ้าเปลี่ยนวัน
                  slotProps={{
                    textField: { size: "small", sx: fieldStyle, placeholder: "DATE" },
                    popper: { sx: pickerStyle },
                  }}
                />
                <TimePicker
                  value={time}
                  ampm={false}
                  minTime={actualMinTime}
                  maxTime={shopClose}
                  onChange={(newValue) => setTime(newValue)}
                  slotProps={{
                    textField: { size: "small", sx: fieldStyle, placeholder: "TIME" },
                    popper: { sx: pickerStyle },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 space-y-4">
            {validationError && (
              <div className="bg-red-500/5 py-2 px-3 rounded-lg border border-red-500/10">
                <p className="text-red-400 text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <span>✧</span> {validationError}
                </p>
              </div>
            )}
            <SubmitButton />
          </div>
        </div>
      </FormComponent>

      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shopName={shop.name} />
    </>
  );
}