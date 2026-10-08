"use client";

import { useEffect, useRef, useState } from "react";
import { en } from "@/content/en";
import styles from "./Header.module.css";

export default function Header({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = matchMedia("(min-width: 801px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className={styles.header} ref={header}>
      <a
        href="#home"
        className={styles.monogram}
        aria-label="Iman Hajiali home"
        onClick={() => setOpen(false)}
      >
        IH
        <span />
      </a>
      <button
        ref={toggle}
        className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? en.closeMenu : en.menu}
        <span aria-hidden="true">+</span>
      </button>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`${styles.navigation} ${open ? styles.open : ""}`}
      >
        {en.navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className={styles.mobileContact} href={`mailto:${email}`}>
          {en.contact}
        </a>
      </nav>
      <a className={styles.contact} href={`mailto:${email}`}>
        {en.contact}
      </a>
    </header>
  );
}
