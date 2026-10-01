import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Iman Hajiali — Product Designer",
  description:
    "Product designer with UI/UX and front-end experience across e-commerce and service platforms.",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#f4ede3" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
