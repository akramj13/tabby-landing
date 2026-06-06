import { Home } from "lucide-react";
import { TabbyButton } from "../components/tabby-button";

export default function PlaygroundRandomFishPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <TabbyButton
        href="/"
        variant="secondary"
        size="md"
        icon={<Home className="h-6 w-6 shrink-0" />}
      >
        Visit landing page
      </TabbyButton>
    </main>
  );
}
