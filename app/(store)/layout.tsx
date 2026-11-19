import { Outfit } from "next/font/google";
import type { ReactNode } from "react";
import { StoreFrame } from "@/components/store/StoreFrame";
import "../store.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`store ${outfit.className}`}>
      <StoreFrame>{children}</StoreFrame>
    </div>
  );
}
