"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "../lib/supabase";
import { DOWNLOAD_URL } from "../lib/site";

type EmailGateContextType = {
  requestDownload: () => void;
};

const EmailGateContext = createContext<EmailGateContextType>({
  requestDownload: () => {},
});

export const useEmailGate = () => useContext(EmailGateContext);

export function EmailGateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const requestDownload = useCallback(() => {
    setIsOpen(true);
    setStatus("idle");
    setEmail("");
  }, []);

  const triggerDownload = () => {
    window.open(DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const { error } = await getSupabase()
        .from("mailing_list")
        .insert({ email });
      if (error) throw error;
      setStatus("success");
      triggerDownload();
      setTimeout(() => setIsOpen(false), 1500);
    } catch {
      setStatus("error");
    }
  };

  const handleSkip = () => {
    triggerDownload();
    setIsOpen(false);
  };

  return (
    <EmailGateContext.Provider value={{ requestDownload }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false);
            }}
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          />

          <div className="relative w-full max-w-md rounded-3xl border-2 border-line bg-background p-8 shadow-[0_8px_0_var(--line)]">
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
                  thanks!
                </h3>
                <p className="mt-2 text-sm text-muted">
                  your download should start shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="tabby-display text-[1.8rem] leading-tight text-ink">
                  stay in the loop
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  optional — get notified when new versions drop.
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
                    className="tabby-button tabby-button-primary h-12 w-full rounded-xl text-base font-semibold"
                  >
                    {status === "loading"
                      ? "..."
                      : "Notify me & download"}
                  </button>
                  {status === "error" && (
                    <p className="text-sm text-red-500">
                      something went wrong. try again.
                    </p>
                  )}
                </form>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="mt-3 w-full text-center text-sm text-subtle transition-colors hover:text-ink"
                >
                  skip, just download
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </EmailGateContext.Provider>
  );
}
