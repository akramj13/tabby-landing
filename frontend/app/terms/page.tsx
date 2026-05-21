import type { Metadata } from "next";
import { LegalPageShell } from "../components/legal-page-shell";
import { GITHUB_URL, SUPPORT_EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Terms of Service - tabby",
  description:
    "Terms of service for tabby - on-device AI autocomplete for macOS.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      current="terms"
      title="Terms of Service"
      summary="By downloading or using tabby, you agree to these terms. tabby is open-source software provided as-is under the AGPL-3.0 license."
      updatedAt="MAY 20, 2026"
    >
      <h2 className="text-lg font-semibold text-ink sm:text-xl">Acceptance</h2>
      <p>
        By downloading, installing, or using tabby, you agree to these terms. If
        you do not agree, do not use the software.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Description of service
      </h2>
      <p>
        tabby is a macOS menu bar application that provides on-device AI
        autocomplete across text fields. It uses local language models to
        generate inline suggestions that appear as ghost text near your cursor.
        All inference runs on your Mac - no text is sent to external servers.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">License</h2>
      <p>
        tabby is open-source software licensed under the{" "}
        <a
          className="tabby-link font-semibold"
          href={`${GITHUB_URL}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GNU Affero General Public License v3.0 (AGPL-3.0)
        </a>
        . You are free to use, modify, and distribute tabby under the terms of
        that license. If you distribute a modified version or make it available
        over a network, you must also make your modifications available under the
        same license.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        User responsibilities
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Use tabby only for lawful purposes.</li>
        <li>
          Review all AI-generated suggestions before sharing, publishing, or
          acting on them.
        </li>
        <li>
          Understand and consent to the macOS permissions tabby requests
          (Accessibility, Input Monitoring, and optionally Screen Recording) as
          described in our{" "}
          <a className="tabby-link font-semibold" href="/privacy">
            privacy policy
          </a>
          .
        </li>
        <li>
          Do not use tabby to generate content that is illegal, harmful, or
          infringes on the rights of others.
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        AI-generated content
      </h2>
      <p>
        tabby generates text suggestions using local language models. These
        suggestions may be inaccurate, incomplete, biased, or inappropriate.
        tabby does not guarantee the quality, accuracy, or fitness of any
        generated content. You are solely responsible for reviewing and deciding
        whether to use any suggestion.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Intellectual property
      </h2>
      <p>
        The tabby source code is licensed under AGPL-3.0. Your content - the
        text you write and the suggestions you accept - belongs to you. tabby
        does not claim any rights over your content and has no ability to access
        or store it outside your device.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Third-party components
      </h2>
      <p>
        tabby incorporates third-party software including llama.cpp,
        Apple&apos;s FoundationModels framework, and the Sparkle update
        framework. GGUF models downloaded through tabby are hosted by Hugging
        Face. Each of these components is governed by its own license and terms.
        By using tabby, you also agree to comply with the applicable terms of
        these third-party components.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Disclaimer of warranties
      </h2>
      <p>
        tabby is provided <strong>&quot;as-is&quot;</strong> and{" "}
        <strong>&quot;as available&quot;</strong> without warranties of any kind,
        whether express or implied, including but not limited to implied
        warranties of merchantability, fitness for a particular purpose, and
        non-infringement. The tabby maintainers do not warrant that the software
        will be uninterrupted, error-free, or free of harmful components.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Limitation of liability
      </h2>
      <p>
        To the maximum extent permitted by applicable law, the tabby maintainers
        shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or any loss of profits, data, or
        use, arising out of or related to your use of tabby, regardless of the
        theory of liability.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Indemnification
      </h2>
      <p>
        You agree to indemnify and hold harmless the tabby maintainers and
        contributors from any claims, damages, or expenses arising from your use
        of tabby or violation of these terms.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Modification of terms
      </h2>
      <p>
        We may update these terms from time to time. Changes will be reflected on
        this page with an updated date. Continued use of tabby after changes are
        posted constitutes acceptance of the revised terms.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">
        Governing law
      </h2>
      <p>
        These terms are governed by and construed in accordance with applicable
        local laws. Any disputes arising from these terms or your use of tabby
        shall be resolved in the courts of the jurisdiction where the primary
        maintainer resides.
      </p>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a
          className="tabby-link font-semibold"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
