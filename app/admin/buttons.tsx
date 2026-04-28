"use client";

import { useTransition } from "react";
import {
  approveBusiness,
  rejectBusiness,
  unapproveBusiness,
  deleteBusiness,
} from "./actions";

function Button({
  onClick,
  children,
  variant,
  pending,
  confirm,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant: "primary" | "danger" | "ghost";
  pending: boolean;
  confirm?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-crab text-white hover:bg-crab-deep shadow-[0_6px_18px_-8px_rgba(208,74,23,0.55)]"
      : variant === "danger"
        ? "bg-white border border-red-300 text-red-700 hover:bg-red-50"
        : "bg-white border border-ink-line text-ink-muted hover:border-ink/40 hover:text-ink";
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        onClick();
      }}
      className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold transition-colors disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  );
}

export function ApproveButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="primary"
      pending={pending}
      onClick={() => start(() => approveBusiness(id))}
    >
      {pending ? "Approving…" : "Approve"}
    </Button>
  );
}

export function RejectButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="danger"
      pending={pending}
      onClick={() => start(() => rejectBusiness(id))}
    >
      {pending ? "Rejecting…" : "Reject"}
    </Button>
  );
}

export function UnapproveButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      pending={pending}
      confirm="Move this business back to Pending? It will be removed from the public site until re-approved."
      onClick={() => start(() => unapproveBusiness(id))}
    >
      {pending ? "Working…" : "Unapprove"}
    </Button>
  );
}

export function DeleteButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="danger"
      pending={pending}
      confirm="Delete this business permanently? This can't be undone."
      onClick={() => start(() => deleteBusiness(id))}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
