/**
 * DarkModeToggle — persists theme preference to localStorage
 * and applies the `dark` class to <html>.
 */
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("aura-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("aura-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("aura-theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setIsDark((v) => !v)}
      className="h-9 w-9 transition-all hover:scale-110"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
    </Button>
  );
};

export default DarkModeToggle;
