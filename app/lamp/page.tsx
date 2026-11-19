import type { Metadata } from "next";
import GenieApp from "@/components/GenieApp";

export const metadata: Metadata = {
  title: { absolute: "2oolz Genie" },
  description: "Forge a tool. Three free wishes. Coins drip every hour. Pay with card via PayPal.",
};

export default function LampPage() {
  return <GenieApp />;
}
