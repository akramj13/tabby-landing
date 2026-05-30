"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "../lib/supabase";
import { DOWNLOAD_URL } from "../lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const NEWSLETTER_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type GateMode = "download" | "newsletter";

type EmailGateContextType = {
  requestDownload: () => void;
  openMailingList: () => void;
};

const EmailGateContext = createContext<EmailGateContextType>({
  requestDownload: () => {},
  openMailingList: () => {},
});

export const useEmailGate = () => useContext(EmailGateContext);

function isValidNewsletterEmail(value: string) {
  return NEWSLETTER_EMAIL_RE.test(value.trim());
}

export function EmailGateProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<GateMode>("download");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const open = useCallback((nextMode: GateMode) => {
    setMode(nextMode);
    setIsOpen(true);
    setStatus("idle");
    setEmail("");
  }, []);

  const requestDownload = useCallback(() => open("download"), [open]);
  const openMailingList = useCallback(() => open("newsletter"), [open]);

  const triggerDownload = () => {
    window.open(DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!isValidNewsletterEmail(normalizedEmail)) {
      setStatus("error");
      return;
    }
    const downloadWindow =
      mode === "download" ? window.open("about:blank", "_blank") : null;
    setStatus("loading");

    try {
      const { error } = await getSupabase()
        .from("mailing_list")
        .insert({ email: normalizedEmail });
      if (error) throw error;
      setStatus("success");
      if (mode === "download") {
        if (downloadWindow) {
          downloadWindow.opener = null;
          downloadWindow.location.href = DOWNLOAD_URL;
        } else {
          triggerDownload();
        }
        setTimeout(() => setIsOpen(false), 1500);
      } else {
        setTimeout(() => setIsOpen(false), 1800);
      }
    } catch {
      if (downloadWindow) downloadWindow.close();
      setStatus("error");
    }
  };

  const handleSkip = () => {
    triggerDownload();
    setIsOpen(false);
  };

  return (
    <EmailGateContext.Provider value={{ requestDownload, openMailingList }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="email-gate"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsOpen(false);
              }}
              role="button"
              tabIndex={-1}
              aria-label="Close modal"
            />

            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: 16 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 10 }
              }
              transition={{ duration: 0.32, ease: EASE }}
              className="relative w-full max-w-md rounded-3xl border-2 border-line bg-surface p-8 shadow-[0_13.4px_0_var(--line)]"
            >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-lg text-subtle transition-colors hover:text-ink"
              aria-label="Close"
            >
              &times;
            </button>

            {status === "success" ? (
              <div className="text-center">
                <h3 className="tabby-display text-[1.8rem] leading-tight text-ink">
                  {mode === "download" ? "thanks!" : "you're on the list!"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {mode === "download"
                    ? "your download should start shortly."
                    : "we'll email you when a new version drops."}
                </p>
              </div>
            ) : (
              <>
                <h3 className="tabby-display text-[1.8rem] leading-tight text-ink">
                  {mode === "download" ? "stay in the loop" : "join the mailing list"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {mode === "download"
                    ? "optional — get notified when new versions drop."
                    : "Get an email whenever a new version of Cotabby ships. No spam, unsubscribe anytime."}
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className="h-12 w-full rounded-xl border-2 border-line bg-surface-2 px-4 text-base text-ink placeholder:text-subtle focus:border-ink focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="tabby-button tabby-button-primary h-12 w-full rounded-xl text-base font-bold"
                  >
                    {status === "loading"
                      ? "..."
                      : mode === "download"
                        ? "Notify me & download"
                        : "Join the list"}
                  </button>
                  {status === "error" && (
                    <p className="text-sm text-red-500">
                      something went wrong. try again.
                    </p>
                  )}
                </form>
                {mode === "download" && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="mt-3 w-full text-center text-sm text-subtle transition-colors hover:text-ink"
                  >
                    skip, just download
                  </button>
                )}
              </>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EmailGateContext.Provider>
  );
}
