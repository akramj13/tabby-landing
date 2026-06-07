"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { TabbyButton } from "@/app/components/ui/tabby-button";
import { isValidEmail, subscribeToMailingList } from "@/app/lib/newsletter";

type Status = "idle" | "loading" | "success" | "error";

/** Inline "join the mailing list" form — email field + submit button. */
export function MailingListInput({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const ok = await subscribeToMailingList(email);
    if (ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        className={`text-sm font-bold tracking-tight text-ink ${className ?? ""}`}
        role="status"
      >
        you&apos;re on the list! 🎉
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full items-end gap-3 sm:w-auto ${className ?? ""}`}
    >
      <span className="tabby-link shrink-0 pb-3.5 text-sm font-bold tracking-tight transition hover:text-ink sm:text-base">
        Join mailing list
      </span>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="you@example.com"
        aria-label="Email address"
        aria-invalid={status === "error"}
        className="shadow-tabby h-12 min-w-0 flex-1 rounded-xl border-2 border-line bg-surface-2 px-4 text-sm font-semibold tracking-tight text-ink placeholder:text-subtle/60 focus:border-ink focus:outline-none sm:w-56 sm:flex-none"
      />
      <TabbyButton
        variant="blue"
        size="icon"
        type="submit"
        disabled={status === "loading"}
        aria-label="Join mailing list"
      >
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </TabbyButton>
    </form>
  );
}
