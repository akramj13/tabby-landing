import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/app/components/layout/legal-page-shell";
import { GITHUB_URL, SUPPORT_EMAIL } from "@/app/lib/site";
import { pageMeta } from "@/app/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "Privacy - Cotabby",
  description: "Privacy policy for Cotabby - local AI autocomplete for macOS.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageShell
      current="privacy"
      title="Privacy"
      summary="Cotabby runs entirely on your Mac. No accounts, no cloud processing, no analytics. This policy explains exactly what the app accesses and why."
      updatedAt="MAY 20, 2026"
    >
      <h2 className="text-lg font-bold text-ink sm:text-xl">Overview</h2>
      <p>
        Cotabby is a local AI autocomplete app for macOS. It is designed
        around a local-first architecture — your writing, keystrokes, and
        suggestions never leave your Mac. There are no user accounts, no hosted
        dashboards, and no cloud-based processing.
      </p>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        What the app accesses locally
      </h2>
      <p>
        To provide inline suggestions, Cotabby reads data from your Mac through
        macOS system APIs. All of this data stays on your device and is never
        transmitted.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Accessibility API data.</strong> Cotabby reads the content of the
          currently focused text field, caret position, and element bounds
          through the macOS Accessibility API. This is how it knows what you are
          typing and where to place suggestions.
        </li>
        <li>
          <strong>Input Monitoring.</strong> Cotabby monitors global keyboard
          events to detect typing activity and Tab key presses for accepting
          suggestions. It categorizes key events (text input, navigation,
          shortcuts) but does not log or store individual keystrokes.
        </li>
        <li>
          <strong>Clipboard contents.</strong> Cotabby reads the system clipboard
          at the time of generating a suggestion to provide additional context to
          the local language model. Clipboard data is not cached, stored, or
          transmitted.
        </li>
        <li>
          <strong>Screen capture.</strong> Cotabby can capture a region around the
          focused text field using ScreenCaptureKit to provide visual context.
          These captures are processed locally and are not stored or transmitted.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        What the app does not collect
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>No usage analytics or telemetry of any kind</li>
        <li>No personal information, email addresses, or identifiers</li>
        <li>No remote logging of text, keystrokes, or suggestions</li>
        <li>No user accounts or authentication</li>
        <li>No cookies or tracking pixels</li>
      </ul>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        Network activity
      </h2>
      <p>
        Cotabby makes two types of network requests, both optional and
        user-visible:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Update checks.</strong> Cotabby uses{" "}
          <a
            className="tabby-link font-bold"
            href="https://sparkle-project.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sparkle
          </a>{" "}
          to check for app updates from{" "}
          <span className="font-bold">updates.cotabby.app</span>. Automatic
          update checks are enabled by default.
        </li>
        <li>
          <strong>Model downloads.</strong> When you choose to download an
          open-source GGUF model, Cotabby fetches it from{" "}
          <a
            className="tabby-link font-bold"
            href="https://huggingface.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hugging Face
          </a>
          . This only happens when you explicitly initiate a download.
        </li>
      </ul>
      <p>No other network requests are made by the app.</p>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        Local storage
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Preferences.</strong> Settings like ghost text color, model
          selection, and suggestion length are stored in macOS UserDefaults on
          your device.
        </li>
        <li>
          <strong>Downloaded models.</strong> GGUF model files you download are
          stored on disk in the app&apos;s local directory. You can delete them
          at any time from within the app.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        macOS permissions
      </h2>
      <p>Cotabby requests the following macOS permissions:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Accessibility.</strong> Required to detect focused text fields,
          read their content, and position ghost text suggestions near the caret.
        </li>
        <li>
          <strong>Input Monitoring.</strong> Required to detect typing activity
          and handle Tab key acceptance of suggestions.
        </li>
        <li>
          <strong>Screen Recording.</strong> Required to capture a screenshot
          around the focused field for visual context (OCR).
        </li>
      </ul>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        Third-party components
      </h2>
      <p>
        Cotabby integrates the following third-party components. None of them
        transmit your data off-device:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>llama.cpp / llama.swift.</strong> Local inference engine for
          running GGUF models on your hardware.
        </li>
        <li>
          <strong>Apple Intelligence.</strong> Apple&apos;s on-device
          FoundationModels runtime (macOS 26+). Governed by Apple&apos;s own
          privacy policy.
        </li>
        <li>
          <strong>Sparkle.</strong> Open-source macOS update framework.
        </li>
        <li>
          <strong>Hugging Face.</strong> Model hosting platform used for GGUF
          downloads. Subject to Hugging Face&apos;s privacy policy during
          downloads only.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-ink sm:text-xl">Open source</h2>
      <p>
        Cotabby is licensed under{" "}
        <a
          className="tabby-link font-bold"
          href={`${GITHUB_URL}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
        >
          AGPL-3.0
        </a>
        . The full source code is available on{" "}
        <a
          className="tabby-link font-bold"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        . You can audit exactly what the app does at any time.
      </p>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        Children&apos;s privacy
      </h2>
      <p>
        Cotabby is not directed at children under 13. We do not knowingly collect
        any data from children. Since Cotabby does not collect personal information
        from anyone, there is no data to identify or remove.
      </p>

      <h2 className="text-lg font-bold text-ink sm:text-xl">
        Changes to this policy
      </h2>
      <p>
        If this policy changes, we will update this page and the &quot;last
        updated&quot; date above. For significant changes, we will note them in
        the{" "}
        <Link className="tabby-link font-bold" href="/release-notes">
          release notes
        </Link>
        .
      </p>

      <h2 className="text-lg font-bold text-ink sm:text-xl">Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a
          className="tabby-link font-bold"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
