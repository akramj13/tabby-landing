import { FadeIn, Stagger, StaggerItem, WordReveal } from "./motion";

export const FAQ_ITEMS = [
  {
    question: "What is Cotabby?",
    answer:
      "Cotabby is an on-device AI autocomplete for macOS. It sits in your menu bar, watches the text field you're typing in, and suggests the next few words as ghost text. Everything runs locally on your Mac.",
  },
  {
    question: "Is Cotabby free?",
    answer:
      "Yes. Cotabby is free and open source under AGPL. No account, no subscription, no usage limits.",
  },
  {
    question: "Does Cotabby send my writing to the cloud?",
    answer:
      "No. All inference happens on your Mac. Cotabby uses either Apple Intelligence or a local GGUF model - there is no cloud API in the current product. Your text never leaves your machine.",
  },
  {
    question: "How does Cotabby actually work?",
    answer:
      "Cotabby reads the focused text field through macOS Accessibility APIs, feeds the text around your caret to an on-device model, and renders the continuation as ghost text near your cursor. Press Tab to accept in chunks, or just keep typing to ignore it.",
  },
  {
    question: "What is the difference between the Apple Intelligence and Open Source engines?",
    answer:
      "Apple Intelligence uses Apple's built-in FoundationModels runtime - no download required, but it needs macOS 26 and supported hardware. The Open Source engine runs local GGUF models through llama.cpp, ships with four built-in models (cotabby-swift-1, cotabby-swift-pro-1, cotabby-balanced-1, and cotabby-careful-1), and lets you bring your own. If Apple Intelligence isn't available on your Mac, the Open Source engine still works.",
  },
  {
    question: "What apps does Cotabby work with?",
    answer:
      "Most macOS text fields - Mail, Slack, Notes, iMessage, browser text areas, and more. Compatibility depends on what each app exposes through Accessibility APIs, so placement and reliability can vary. Some apps work great, others are hit or miss.",
  },
  {
    question: "What permissions does Cotabby need?",
    answer:
      "Accessibility, Input Monitoring, and Screen Recording. Accessibility lets Cotabby detect the focused field, read nearby text, and place suggestions. Input Monitoring lets Cotabby see your keystrokes and handle Tab acceptance. Screen Recording lets Cotabby capture a screenshot around the focused field for visual context (OCR).",
  },
  {
    question: "What macOS version do I need?",
    answer:
      "macOS 15.0 or later for the Open Source engine. Apple Intelligence requires macOS 26 and compatible hardware.",
  },
  {
    question: "How much space do the models take?",
    answer:
      "They range from about 0.4 GB for cotabby-swift-1 up to about 1.1 GB for cotabby-careful-1, with cotabby-swift-pro-1 (~0.6 GB) and cotabby-balanced-1 (~0.8 GB) in between. Apple Intelligence uses the system runtime, so no separate download. You can also add your own GGUF models if you prefer something different.",
  },
  {
    question: "Does Cotabby work offline?",
    answer:
      "Yes. Once a model is downloaded, Cotabby runs entirely offline. No network connection needed for suggestions.",
  },
  {
    question: "Why am I not seeing suggestions?",
    answer:
      "Usually it's a missing permission, Cotabby being paused, or no model installed yet. Check that Accessibility, Input Monitoring, and Screen Recording are enabled in System Settings, make sure Cotabby is active in the menu bar, and confirm you have a model selected. Some apps also don't expose enough accessibility data for Cotabby to work.",
  },
  {
    question: "Does Cotabby slow down my Mac?",
    answer:
      "Cotabby only runs inference when you pause typing, and the models are designed to be lightweight. cotabby-swift-1 uses minimal resources. You might notice slightly more CPU usage with the larger models like cotabby-careful-1, but it shouldn't affect normal use.",
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
            <details className="group overflow-hidden rounded-2xl border-2 border-line bg-surface-2 shadow-[0_6.7px_0_var(--line)] transition-all duration-200 open:bg-surface-3 hover:-translate-y-px">
              <summary className="list-none cursor-pointer px-6 py-5 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-left text-base font-semibold tracking-tight text-ink sm:text-lg">
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
