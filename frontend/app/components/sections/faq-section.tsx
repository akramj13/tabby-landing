import {
  AppWindow,
  BrainCircuit,
  Cpu,
  Download,
  Gift,
  Keyboard,
  KeyRound,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Stagger, StaggerItem } from "@/app/components/ui/motion";
import { PeekingCatMascot } from "@/app/components/ui/peeking-cat-mascot";
import { SectionHeading } from "@/app/components/ui/section-heading";
import { TabbyPanel } from "@/app/components/ui/tabby-panel";

export const FAQ_ITEMS: {
  question: string;
  answer: string;
  icon: LucideIcon;
}[] = [
  {
    icon: Sparkles,
    question: "What is Cotabby?",
    answer:
      "A free macOS menu bar app that adds AI autocomplete to almost any text field. Gray ghost text appears as you type — press Tab to accept, or keep typing to ignore.",
  },
  {
    icon: Gift,
    question: "Is it free?",
    answer:
      "Yes. Free and open source (AGPL-3.0). No account, no subscription, no cloud costs.",
  },
  {
    icon: ShieldCheck,
    question: "Is my data private?",
    answer:
      "Yes. Everything runs on your Mac. No cloud, no telemetry, no analytics. Clipboard and nearby screen text are read only to inform a suggestion, never stored or sent. The network is only used to download models and check for updates.",
  },
  {
    icon: Cpu,
    question: "What are the system requirements?",
    answer:
      "macOS 14 or later, Apple Silicon recommended. Local models need 1–5 GB of disk space. Apple Intelligence requires macOS 26+ on a supported Mac.",
  },
  {
    icon: Download,
    question: "How do I install it?",
    answer:
      "Homebrew: brew install --cask cotabby. Or download from cotabby.app and drag to Applications. Updates install automatically.",
  },
  {
    icon: KeyRound,
    question: "Why does it need Accessibility and Screen Recording permissions?",
    answer:
      "To work inside other apps. Accessibility reads your text field and inserts suggestions. Input Monitoring detects the Tab key. Screen Recording reads context near your cursor. It never runs in password fields.",
  },
  {
    icon: Keyboard,
    question: "How do I accept or dismiss a suggestion?",
    answer:
      "Tab accepts the next word. Backtick accepts the whole suggestion. Esc or keep typing dismisses. All keys are rebindable in Settings.",
  },
  {
    icon: AppWindow,
    question: "Which apps does it work in?",
    answer:
      "Almost any editable text field — native Mac apps, Chrome, and most Electron apps. It stays out of password fields and terminals.",
  },
  {
    icon: BrainCircuit,
    question: "Which AI model does it use? Does it work offline?",
    answer:
      "Pick Apple Intelligence (built into macOS 26+) or a local Open Source model (1–5 GB). Both run on-device, so it works fully offline.",
  },
  {
    icon: SlidersHorizontal,
    question: "How do I customize it or turn it off?",
    answer:
      "Open Settings from the menu bar icon to change models, shortcuts, ghost text style, and more. Toggle \"Enable Globally\" off to pause, or add specific apps to the Disabled list.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <SectionHeading
        title="questions, answered"
        subtitle="The basics, without the enterprise brochure voice."
      />

      <Stagger stagger={0.06} className="mt-16 space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.question} className="relative">
              {index === 0 ? <PeekingCatMascot /> : null}
              <TabbyPanel as="details" size="md" tone="bg-surface-2" className="group relative z-10 overflow-hidden transition-all duration-200 open:bg-surface-3 hover:-translate-y-px">
                <summary className="list-none cursor-pointer px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-4">
                    <Icon
                      className="h-5 w-5 shrink-0 text-ink transition-colors duration-200 group-open:text-accent"
                      strokeWidth={2}
                    />
                    <span className="text-left text-base font-semibold tracking-tight text-ink sm:text-lg">
                      {item.question}
                    </span>
                  </div>
                </summary>

                <div className="border-t-2 border-line-soft px-6 pb-6 pl-[3.75rem] pt-4">
                  <p className="text-sm leading-relaxed text-muted sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </TabbyPanel>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
