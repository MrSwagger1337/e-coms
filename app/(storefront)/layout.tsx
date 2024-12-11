import { type ReactNode } from "react";
import { Navbar } from "../components/storefront/Navbar";
import { Footer } from "../components/storefront/Footer";

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-gray-50 from-25% via-pink-400 via-40% to-white to-70%">
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
