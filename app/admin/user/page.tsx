"use client";

import AdminUserEditorCard, {
  EditableUser,
} from "@/component/Profile/AdminUserEditCard";
import getAllUser from "@/libs/admin/getAllUser";
import restoreArchivedEmail from "@/libs/admin/restoreArchivedEmail";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ArchivedUser = {
  _id: string;
  email: string;
  name: string;
  deletedAt?: string;
};

export default function AdminUserPage() {
  console.log("BACKEND_URL:", process.env.BACKEND_URL);
  const { data: session, status } = useSession();
  const [allUserData, setAllUserData] = useState<EditableUser[]>([]);
  const [archivedUsers, setArchivedUsers] = useState<ArchivedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllUsers() {
      if (!session?.user?.token) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await getAllUser(session.user.token);
        setAllUserData(res.data ?? []);
        setArchivedUsers(res.archivedData ?? []);
      } catch {
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.token) {
      void fetchAllUsers();
      return;
    }

    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session?.user?.token, status]);

  const handleUserSaved = (updatedUser: EditableUser) => {
    setAllUserData((prev) =>
      prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)),
    );
  };

  const handleUserDeleted = (deletedUser: EditableUser) => {
    setAllUserData((prev) =>
      prev.filter((user) => user._id !== deletedUser._id),
    );
    setArchivedUsers((prev) => {
      if (prev.some((entry) => entry.email === deletedUser.email)) {
        return prev;
      }

      return [
        {
          _id: deletedUser._id,
          email: deletedUser.email,
          name: deletedUser.name,
        },
        ...prev,
      ];
    });
  };

  const formatDeletedAt = (deletedAt?: string) => {
    if (!deletedAt) return "Recently deleted";

    const date = new Date(deletedAt);
    if (Number.isNaN(date.getTime())) return "Recently deleted";

    return date.toLocaleString();
  };

  const handleRestoreArchivedEmail = async (archiveId: string) => {
    if (!session?.user?.token) return;

    setRestoringId(archiveId);
    setError(null);

    try {
      await restoreArchivedEmail(session.user.token, archiveId);
      setArchivedUsers((prev) =>
        prev.filter((entry) => entry._id !== archiveId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to restore archived email",
      );
    } finally {
      setRestoringId(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="m-10 text-sm uppercase tracking-[0.2em] text-text-sub">
        Loading users...
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div className="m-10 text-sm uppercase tracking-[0.2em] text-red-400">
        Admin access required
      </div>
    );
  }

  return (
    <main className="m-4 sm:m-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-text-main">User Management</h1>
        <p className="text-sm uppercase tracking-[0.2em] text-text-sub">
          Edit other users without leaving the admin dashboard
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5">
        {allUserData.map((user) => (
          <AdminUserEditorCard
            key={user._id}
            user={user}
            token={session.user.token}
            isCurrentUser={user._id === session.user._id}
            onSaved={handleUserSaved}
            onDeleted={handleUserDeleted}
          />
        ))}
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-400/10 via-card to-card p-6 shadow-xl">
        <div
          className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red-300/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-text-main">
              Archived Gmail List
            </h2>
            <p className="text-xs uppercase tracking-[0.24em] text-text-sub">
              Hard-deleted emails are blocked from registering again
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-red-400/45 bg-red-200/70 px-4 py-1 text-[11px] uppercase tracking-[0.2em] text-text-main dark:border-red-300/40 dark:bg-red-500/10 dark:text-text-main">
            {archivedUsers.length} blocked email
            {archivedUsers.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {archivedUsers.length > 0 ? (
            archivedUsers.map((user) => (
              <article
                key={user._id}
                className="rounded-2xl border border-red-400/45 bg-red-100/70 p-4 backdrop-blur-sm transition hover:border-red-500/60 hover:bg-red-100 dark:border-red-300/30 dark:bg-red-500/[0.08] dark:hover:border-red-200/50 dark:hover:bg-red-500/[0.14]"
              >
                <p className="break-all text-sm font-semibold text-text-main">
                  {user.email}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-text-sub">
                  {user.name}
                </p>
                <p className="mt-3 text-xs text-text-sub">
                  Deleted: {formatDeletedAt(user.deletedAt)}
                </p>
                <button
                  type="button"
                  onClick={() => void handleRestoreArchivedEmail(user._id)}
                  disabled={restoringId === user._id}
                  className="mt-4 rounded-xl border border-red-600 bg-red-600 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {restoringId === user._id ? "Restoring..." : "Restore Email"}
                </button>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-red-400/45 bg-red-100/60 px-4 py-5 text-sm text-text-main dark:border-red-300/35 dark:bg-red-500/[0.05] dark:text-text-main">
              No archived emails yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
