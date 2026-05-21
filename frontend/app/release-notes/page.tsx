import type { Metadata } from "next";
import { LegalPageShell } from "../components/legal-page-shell";
import { GITHUB_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Release Notes - tabby",
  description: "Product updates and release notes for tabby.",
};

export default function ReleaseNotesPage() {
  return (
    <LegalPageShell
      current="release-notes"
      title="Release Notes"
      summary="Updates, fixes, and changes for each release of tabby."
      updatedAt="MAY 20, 2026"
    >
      <div>
        <h2 className="text-lg font-semibold text-ink sm:text-xl">
          v1.0.2-beta
        </h2>
        <p className="text-xs font-medium tracking-wide text-subtle">
          May 21, 2026 · Latest
        </p>
      </div>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Per-app controls - enable or disable tabby for specific applications
        </li>
        <li>AXObserver tracking for improved text field detection</li>
        <li>KV prefix cache for faster repeated suggestions</li>
        <li>Ghost text wrapping for long suggestions</li>
        <li>Onboarding profile setup</li>
        <li>
          Clipboard context - suggestions informed by recent clipboard content
        </li>
        <li>Visual context screenshots via ScreenCaptureKit</li>
        <li>DMG installer packaging</li>
        <li>Sparkle update framework fix</li>
        <li>Prompt context sanitization</li>
        <li>macOS 15 backport (previously macOS 26+ only)</li>
        <li>Relicensed from MIT to AGPL-3.0</li>
      </ul>

      <div>
        <h2 className="text-lg font-semibold text-ink sm:text-xl">
          v1.0.1-beta
        </h2>
        <p className="text-xs font-medium tracking-wide text-subtle">
          May 6, 2026
        </p>
      </div>
      <p>Patch release with stability improvements from the initial beta.</p>

      <div>
        <h2 className="text-lg font-semibold text-ink sm:text-xl">
          v1.0.0-beta
        </h2>
        <p className="text-xs font-medium tracking-wide text-subtle">
          May 5, 2026
        </p>
      </div>
      <p>
        First public beta of tabby. Core autocomplete functionality with Apple
        Intelligence and open-source GGUF model support.
      </p>

      <div>
        <h2 className="text-lg font-semibold text-ink sm:text-xl">v0.0.0.0</h2>
        <p className="text-xs font-medium tracking-wide text-subtle">
          April 28, 2026
        </p>
      </div>
      <ul className="list-disc space-y-2 pl-5">
        <li>CI gates - build, lint, and test automation</li>
        <li>Initial test suite</li>
        <li>Sparkle release pipeline with Ed25519 signing</li>
        <li>macOS notarization</li>
      </ul>

      <div>
        <h2 className="text-lg font-semibold text-ink sm:text-xl">v0.1.0</h2>
        <p className="text-xs font-medium tracking-wide text-subtle">
          April 6, 2026
        </p>
      </div>
      <p>Initial release - proof of concept for on-device autocomplete.</p>

      <p className="border-t-2 border-line pt-6">
        Full commit history and release assets are available on{" "}
        <a
          className="tabby-link font-semibold"
          href={`${GITHUB_URL}/releases`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Releases
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
