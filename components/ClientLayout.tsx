"use client";

import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-20">{children}</main>
    </>
  );
}
