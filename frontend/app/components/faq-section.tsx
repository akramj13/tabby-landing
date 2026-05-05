import { FadeIn, Stagger, StaggerItem, WordReveal } from "./motion";

export const FAQ_ITEMS = [
  {
    question: "What is tabby?",
    answer:
      "tabby is an on-device AI autocomplete app for macOS text fields. It lives in your menu bar, suggests the next few words inline, and helps you keep writing in the apps you already use.",
  },
  {
    question: "How does tabby actually work?",
    answer:
      "tabby watches the focused text field through macOS Accessibility APIs, reads the text around your caret, asks the active on-device engine for a short continuation, and shows it as ghost text near the cursor. When the context still matches, you can keep accepting the remaining suggestion in chunks with Tab.",
  },
  {
    question: "Does tabby send my writing to the cloud?",
    answer:
      "No. Tabby's current architecture is built around on-device inference. You can use either Apple Intelligence when it is available on your Mac, or a local open source GGUF model running through tabby's built-in runtime. There is no required hosted inference API in the current product.",
  },
  {
    question: "What permissions does tabby need?",
    answer:
      "tabby needs Accessibility and Input Monitoring for core autocomplete. Accessibility lets tabby detect the focused editable field, read nearby text, and place suggestions near the caret. Input Monitoring lets tabby detect your typing and handle Tab acceptance. Screen Recording is not required for normal autocomplete use.",
  },
  {
    question:
      "What is the difference between Apple Intelligence and Open Source?",
    answer:
      "Apple Intelligence uses Apple's on-device FoundationModels runtime and does not require downloading a GGUF file. The Open Source engine uses local GGUF models through llama.cpp via llama.swift, which gives you more control over model choice and lets you use Tabby's built-in models or bring your own. If Apple Intelligence is unavailable on your machine, you can still use the Open Source path.",
  },
  {
    question: "How do I accept or dismiss a suggestion?",
    answer:
      "When tabby shows ghost text, press Tab to accept the next chunk of the suggestion. You can keep pressing Tab to move through the remaining tail, or just keep typing normally if you want to go in a different direction. If your text changes enough, tabby will drop the old suggestion and wait for a better one.",
  },
  {
    question: "What apps does tabby work with?",
    answer:
      "tabby is built to work across many macOS text fields, including native apps and browser-based editors, but compatibility depends on what each app exposes through accessibility. Some editors provide precise caret and text geometry, while others only expose coarse field information, so placement and reliability can vary by app.",
  },
  {
    question: "How do I download models or use my own?",
    answer:
      "If you choose the Open Source engine, you can download one of Tabby's built-in models directly from onboarding or Settings and watch its install progress in the app. You can also open the models folder, drop in your own .gguf file, and refresh the model list without restarting tabby.",
  },
  {
    question: "Why am I not seeing suggestions?",
    answer:
      "The most common reasons are missing permissions, tabby being disabled, no local model installed for the Open Source engine, Apple Intelligence not being available, or the current app not exposing enough accessibility data for autocomplete. Start by checking Accessibility and Input Monitoring, then confirm your engine and model selection in the menu bar or Settings.",
  },
  {
    question: "Can I customize how tabby behaves?",
    answer:
      "Yes. You can choose the engine, change suggestion length, switch the indicator style, pick a ghost text color, manage local models, and, for the Open Source engine, choose between Fast mode and Use My Instructions. You can also save custom AI instructions to steer tone, style, audience, or formatting preferences over time.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <WordReveal
        as="h2"
        text="questions, answered"
        className="tabby-display text-center text-[2.8rem] leading-[1.02] tracking-tight text-ink sm:text-[4rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          The basics, without the enterprise brochure voice.
        </p>
      </FadeIn>

      <Stagger stagger={0.06} className="mt-10 space-y-3">
        {FAQ_ITEMS.map((item) => (
          <StaggerItem key={item.question}>
            <details className="group overflow-hidden rounded-2xl border-2 border-line bg-surface-2 shadow-[0_4px_0_var(--line)] transition-all duration-200 open:bg-surface-3 hover:-translate-y-px">
              <summary className="list-none cursor-pointer px-6 py-5 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-left text-base font-medium tracking-tight text-ink sm:text-lg">
                    {item.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-background text-xl leading-none text-ink transition-transform duration-200 group-open:rotate-45 group-open:bg-accent/20">
                    +
                  </span>
                </div>
              </summary>

              <div className="border-t-2 border-line-soft px-6 pb-6 pr-14 pt-4">
                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {item.answer}
                </p>
              </div>
            </details>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
