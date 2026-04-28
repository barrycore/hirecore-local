"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(
    searchParams.get("mode") === "signup",
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";

      const payload = isSignup
        ? {
            email,
            password,
            fullName,
            phoneNumber,
          }
        : {
            email,
            password,
          };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast({
        title: isSignup ? "Account created" : "Welcome back",
        description: isSignup
          ? "Your HireCore account has been created."
          : "You have signed in successfully.",
      });

      window.location.href = redirect;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Auth failed",
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.18),transparent_35%),radial-gradient(circle_at_80%_90%,hsl(var(--secondary)/0.14),transparent_40%)]" />

      <Link
        href="/"
        className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-4xl border border-border bg-card/80 p-8 text-card-foreground shadow-2xl backdrop-blur-2xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Image
              src="/HireCore.png"
              alt="HireCore Local"
              width={64}
              height={64}
            />
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight">
            HireCore Local
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup ? "Create your account" : "Welcome back — sign in"}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full border-border bg-surface text-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {isSignup && (
            <>
              <div>
                <Label className="text-sm text-foreground">Full name</Label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  className="mt-2 h-12 rounded-full border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-sm text-foreground">
                  Phone number
                </Label>
                <Input
                  type="tel"
                  placeholder="+233..."
                  className="mt-2 h-12 rounded-full border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </>
          )}

          <div>
            <Label className="text-sm text-foreground">Email</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-full border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-foreground">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-full border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="font-semibold text-primary transition hover:underline"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}