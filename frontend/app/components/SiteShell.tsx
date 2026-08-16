"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/feeds", label: "Feeds / Posts" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("relay-theme") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem("relay-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" onClick={() => setMenuOpen(false)}><span className="brand-mark">R</span><span>Relay / RSS LMS</span></Link>
        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
        </nav>
        <button className={`menu-toggle ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen}><span /><span /><span /></button>
      </header>
      {children}
      <footer className="site-footer"><span>RSS Server / LMS project</span><span>Student name | Student ID</span></footer>
    </>
  );
}
