"use client";

import Image from "next/image";
import { useRef, useCallback, useState } from "react";
import { MassageType } from "@/libs/shops/createShop";

export interface Promotion {
  title: string;
  description?: string;
  discountPrice: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold tracking-[0.18em] text-text-sub uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-b border-card-border py-1.5 text-sm text-text-main
          placeholder:text-text-sub focus:outline-none focus:border-gold
          transition-colors duration-200 w-full"
      />
    </div>
  );
}

// --- Textarea Component ---
export function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold tracking-[0.18em] text-text-sub uppercase">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="bg-transparent border border-card-border rounded p-2 text-sm text-text-main
          placeholder:text-text-sub focus:outline-none focus:border-gold
          transition-colors duration-200 w-full resize-none"
      />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] font-black tracking-[0.3em] text-gold uppercase whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-card-border" />
    </div>
  );
}

// --- MassageCard (Updated with Promotion & Package Logic) ---
export const emptyMassage = (): MassageType & {
  _id: string;
  isPackage: boolean;
  isActive: boolean;
  promotions: Promotion[];
} => ({
  _id: crypto.randomUUID(),
  name: "",
  description: "",
  price: 0,
  picture: "",
  isPackage: false,
  isActive: true,
  promotions: [],
});

export function MassageCard({
  index,
  item,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  item: any; // ตาม Type เดิมของคุณ
  onChange: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  const [localError, setLocalError] = useState("");
  const hasPromotion = item.promotions.length > 0;

  const validate = (field: string, value: any) => {
    const promo = item.promotions[0];
    const checkPromo = { ...promo, [field]: value };
    let error = "";

    if (field === "discountPrice" && Number(value) >= item.price) {
      error = "Discount price must be lower than the full price.";
    } 
    else if (new Date(checkPromo.startDate) > new Date(checkPromo.endDate)) {
      error = "Start date cannot be later than the end date.";
    }
    else if (field === "title" && value.length > 50) {
      error = "Title is too long (max 50 chars).";
    }
    else if (item.price <= 0 && hasPromotion) {
      error = "Please set a valid service price before adding a promotion.";
    }

    setLocalError(error);
    
    updatePromoField(field as any, value);
  };

  const togglePromo = () => {
    if (hasPromotion) {
      onChange(item._id, "promotions", []);
    } else {
      onChange(item._id, "promotions", [
        {
          title: "Flash Sale",
          description: "", // เพิ่ม description เพื่อรองรับ AC
          discountPrice: item.price > 0 ? Math.floor(item.price * 0.9) : 0,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          isActive: true, // สถานะเริ่มต้นเป็น Active
        },
      ]);
    }
  };

  const updatePromoField = (field: keyof Promotion, value: any) => {
    const newPromos = [...item.promotions];
    if (newPromos.length === 0) return;
    newPromos[0] = { ...newPromos[0], [field]: value };
    onChange(item._id, "promotions", newPromos);
  };

  return (
    <div className="group bg-card/5 p-6 rounded-sm space-y-6 hover:bg-card/10 transition-all duration-700 border border-transparent hover:border-gold/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-[1px] bg-gold/50" />
            <span className="text-[8px] tracking-[0.4em] text-text-sub uppercase font-bold">
              {item.isPackage ? "Bundle Package" : "Treatment"}{" "}
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          {/* Status Toggles */}
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={() => onChange(item._id, "isPackage", !item.isPackage)}
              className={`text-[8px] px-2 py-0.5 border transition-all ${item.isPackage ? "border-gold text-gold bg-gold/10" : "border-card-border text-text-sub"}`}
            >
              PACKAGE
            </button>
            <button
              onClick={() => onChange(item._id, "isActive", !item.isActive)}
              className={`text-[8px] px-2 py-0.5 border transition-all ${item.isActive ? "border-emerald-500/50 text-emerald-400" : "border-red-500/50 text-red-400"}`}
            >
              {item.isActive ? "ACTIVE" : "HIDDEN"}
            </button>
          </div>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(item._id)}
            className="opacity-40 group-hover:opacity-100 text-text-sub hover:text-red-400 transition-all duration-300 text-[9px] uppercase tracking-widest"
          >
            — Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field
          label="Service Name *"
          value={item.name}
          onChange={(v) => onChange(item._id, "name", v)}
          placeholder="E.g. Signature Aromatherapy"
        />
        <Field
          label="Full Price (THB) *"
          value={item.price === 0 ? "" : String(item.price)}
          onChange={(v) => onChange(item._id, "price", Number(v))}
          placeholder="0.00"
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field
          label="Description"
          value={item.description ?? ""}
          onChange={(v) => onChange(item._id, "description", v)}
          placeholder="Describe the sensory experience..."
        />
        <Field
          label="Visual Link"
          value={item.picture ?? ""}
          onChange={(v) => onChange(item._id, "picture", v)}
          placeholder="https://source.unsplash.com/..."
        />
      </div>

      <div className="pt-2 border-t border-card-border/30">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePromo}
            className="text-[9px] tracking-[0.3em] text-gold uppercase hover:underline"
          >
            {hasPromotion ? "✕ Remove Promotion" : "+ Add Special Promotion"}
          </button>

          {/* 3. เพิ่มสถานะ Active/Deactivate (AC: Shop owner selects Deactivate) */}
          {hasPromotion && (
            <button
              onClick={() =>
                updatePromoField("isActive", !item.promotions[0].isActive)
              }
              className={`text-[8px] px-2 py-0.5 border transition-all ${item.promotions[0].isActive ? "border-emerald-500/50 text-emerald-400" : "border-stone-500 text-stone-500"}`}
            >
              {item.promotions[0].isActive
                ? "PROMO: ACTIVE"
                : "PROMO: DEACTIVATED"}
            </button>
          )}
        </div>

        {hasPromotion && (
          <div className={`mt-4 p-4 bg-black/5 rounded border ${localError ? 'border-red-500/50' : 'border-gold/10'} space-y-4 transition-colors duration-300`}>
            {/* Promotion Fields */}
            <div className="grid grid-cols-2 gap-6">
              <Field
                label="Promo Title"
                value={item.promotions[0].title}
                onChange={(v) => validate("title", v)}
              />
              <Field
                label="Discounted Price"
                value={String(item.promotions[0].discountPrice)}
                onChange={(v) => validate("discountPrice", Number(v))}
                type="number"
              />
            </div>
            <Field
              label="Promotion Description"
              value={item.promotions[0].description ?? ""}
              onChange={(v) => updatePromoField("description", v)}
              placeholder="Details of the offer..."
            />
            <div className="grid grid-cols-2 gap-6">
               <Field label="Start Date" type="date" value={item.promotions[0].startDate.split('T')[0]} onChange={(v) => validate("startDate", v)} />
               <Field label="End Date" type="date" value={item.promotions[0].endDate.split('T')[0]} onChange={(v) => validate("endDate", v)} />
            </div>

            {localError && (
              <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-1">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                <p className="text-[9px] text-red-400 uppercase tracking-widest italic font-medium">
                  {localError}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ImageDropZone ────────────────────────────────────────────────────────────
/**
 * Handles both URL input and file drag-and-drop / click-to-browse.
 * URL takes priority: when imageURL is non-empty the preview shows the URL
 * image and the file input is ignored on submit.
 */
export function ImageDropZone({
  imageURL,
  onImageURLChange,
  previewURL, // object URL from a local file (used only when imageURL is empty)
  onFileChange,
  shopName,
  massageCount,
}: {
  imageURL: string;
  onImageURLChange: (url: string) => void;
  previewURL: string;
  onFileChange: (file: File) => void;
  shopName: string;
  massageCount: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlMode, setUrlMode] = useState<boolean>(!!imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFileChange(file);
    },
    [onFileChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // The preview source: URL wins over local file blob
  const activePreview = imageURL.trim() || previewURL;

  return (
    <div className="hidden md:flex md:w-[380px] flex-shrink-0 flex-col">
      {/* ── drop area ── */}
      <div
        className={`flex-1 relative cursor-pointer group transition-all duration-300
          ${isDragging ? "bg-card-border" : "bg-background"}
          ${urlMode ? "pointer-events-none" : ""}`}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !urlMode && fileInputRef.current?.click()}
      >
        {activePreview ? (
          <>
            <Image
              src={activePreview}
              alt="shop preview"
              fill
              className="object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {!urlMode && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                <div className="border border-white/30 px-6 py-2 backdrop-blur-sm">
                  <p className="text-white text-xs tracking-[0.2em] uppercase">
                    Change Photo
                  </p>
                </div>
              </div>
            )}
            {/* URL badge */}
            {imageURL.trim() && (
              <div className="absolute top-3 left-3 bg-gold/90 text-black text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                URL
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors
                ${isDragging ? "border-gold bg-gold/10" : "border-text-sub group-hover:border-text-sub"}`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${isDragging ? "text-gold" : "text-stone-500 group-hover:text-stone-300"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className={`text-xs tracking-[0.2em] uppercase transition-colors
                  ${isDragging ? "text-gold" : "text-stone-500 group-hover:text-text-sub"}`}
              >
                {isDragging ? "Drop to upload" : "Drag & drop photo"}
              </p>
              <p className="text-[10px] text-card-border mt-1 tracking-wider">
                or click to browse
              </p>
              <p className="text-[10px] text-card-border mt-1 tracking-wider">
                uploaded on submit
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {/* ── URL / File toggle + URL input ── */}
      <div className="bg-background border-t border-card-border px-5 pt-4 pb-3 space-y-3">
        {/* toggle */}
        <div className="flex items-center gap-1 bg-stone-900 rounded p-0.5 w-fit">
          <button
            type="button"
            onClick={() => setUrlMode(false)}
            className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
              ${!urlMode ? "bg-card-border text-text-main" : "text-text-sub hover:text-text-sub"}`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setUrlMode(true)}
            className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
              ${urlMode ? "bg-gold text-black font-bold" : "text-text-sub hover:text-text-sub"}`}
          >
            Image URL
          </button>
        </div>

        {/* URL input — only visible when urlMode */}
        {urlMode && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-[0.18em] text-text-sub uppercase">
              Image URL
            </label>
            <input
              type="url"
              value={imageURL}
              onChange={(e) => onImageURLChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="bg-transparent border-b border-card-border py-1.5 text-xs text-text-main
                placeholder:text-text-sub focus:outline-none focus:border-gold
                transition-colors duration-200 w-full"
            />
            {imageURL.trim() && (
              <p className="text-[9px] text-gold tracking-wider mt-0.5">
                ✦ URL takes priority over file upload
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── name / count preview ── */}
      <div className="bg-background px-8 py-6 border-t border-card-border">
        <p className="text-[9px] tracking-[0.3em] text-text-sub uppercase mb-1">
          Shop
        </p>
        <p className="text-stone-200 text-lg font-light tracking-wider truncate">
          {shopName || (
            <span className="text-card-border italic">Untitled</span>
          )}
        </p>
        {massageCount > 0 && (
          <p className="text-text-sub text-xs mt-1 tracking-wide">
            {massageCount} massage type{massageCount > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── MobileImageDrop ──────────────────────────────────────────────────────────
export function MobileImageDrop({
  imageURL,
  onImageURLChange,
  previewURL,
  onFileChange,
}: {
  imageURL: string;
  onImageURLChange: (url: string) => void;
  previewURL: string;
  onFileChange: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlMode, setUrlMode] = useState<boolean>(!!imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePreview = imageURL.trim() || previewURL;

  return (
    <div className="md:hidden space-y-3">
      {/* toggle */}
      <div className="flex items-center gap-1 bg-stone-900 rounded p-0.5 w-fit">
        <button
          type="button"
          onClick={() => setUrlMode(false)}
          className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
            ${!urlMode ? "bg-card-border text-text-main" : "text-text-sub hover:text-text-sub"}`}
        >
          File Upload
        </button>
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
            ${urlMode ? "bg-gold text-black font-bold" : "text-text-sub hover:text-text-sub"}`}
        >
          Image URL
        </button>
      </div>

      {urlMode ? (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold tracking-[0.18em] text-text-sub uppercase">
            Image URL
          </label>
          <input
            type="url"
            value={imageURL}
            onChange={(e) => onImageURLChange(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="bg-transparent border-b border-card-border py-1.5 text-sm text-text-main
              placeholder:text-text-sub focus:outline-none focus:border-gold
              transition-colors duration-200 w-full"
          />
          {activePreview && (
            <div className="relative h-40 rounded overflow-hidden mt-2">
              <Image
                src={activePreview}
                alt="preview"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-gold/90 text-black text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                URL
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="border border-dashed border-card-border rounded-lg p-6 text-center
            cursor-pointer hover:border-stone-500 transition-colors"
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file?.type.startsWith("image/")) onFileChange(file);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewURL ? (
            <div className="relative h-40 rounded overflow-hidden">
              <Image
                src={previewURL}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <p className="text-stone-500 text-xs tracking-widest uppercase">
              {isDragging ? "Drop here" : "Tap to add photo"}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileChange(f);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
export function Step({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors
          ${done ? "bg-emerald-400" : active ? "bg-gold" : "bg-card-border"}`}
      />
      <span
        className={`text-[9px] tracking-widest uppercase transition-colors
          ${done ? "text-emerald-400" : active ? "text-gold" : "text-card-border"}`}
      >
        {label}
      </span>
    </div>
  );
}
