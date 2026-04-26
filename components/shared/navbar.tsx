"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Briefcase,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const navLinks = [
    { href: "/tasks", label: "Browse Tasks" },
    { href: "/apply-workforce", label: "Join Workforce" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled
          ? "bg-background/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]"
          : "bg-background/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.1)]"
      )}
    >
      {/* Gloss Layer */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-40" />

      <div className="relative flex h-[70px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3b35c4] shadow-[0_6px_20px_rgba(59,53,196,0.4)] transition group-hover:scale-105">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground/80 group-hover:text-foreground transition">
            Hire<span className="text-[#3b35c4]">Core</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition hover:drop-shadow-[0_0_6px_rgba(59,53,196,0.5)]"
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#3b35c4]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 backdrop-blur-md hover:bg-accent transition"
          >
            <Sun
              className={cn(
                "absolute h-4 w-4 transition-all",
                theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100"
              )}
            />
            <Moon
              className={cn(
                "absolute h-4 w-4 transition-all",
                theme === "dark" ? "scale-100" : "scale-0"
              )}
            />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-black/5"
              >
                <Avatar className="h-8 w-8 shadow-md">
                  <AvatarFallback className="bg-[#3b35c4]/90 text-white">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    userMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-background/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-2 overflow-hidden animate-in fade-in zoom-in-95">
                  {/* Gloss */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-30" />

                  <div className="relative flex flex-col gap-1">
                    <Link
                      href="/profile"
                      className="px-3 py-2 text-sm rounded-lg transition hover:bg-accent hover:text-foreground"
                    >
                      Profile
                    </Link>

                    <div className="h-px bg-border/50 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-destructive transition hover:bg-destructive/10"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-4 backdrop-blur-md"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/login?mode=signup">
                <Button
                  size="sm"
                  className="rounded-full px-5 bg-[#3b35c4] text-white shadow-[0_6px_20px_rgba(59,53,196,0.4)] hover:scale-[1.03] transition"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background/90 backdrop-blur-xl p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
