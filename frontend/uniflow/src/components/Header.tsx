import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface HeaderProps {
  activeTab: "dashboard" | "calendar"
  onTabChange: (tab: "dashboard" | "calendar") => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    
    setIsDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary-foreground"
            >
              <rect x="4" y="4" width="4" height="4" fill="currentColor" />
              <rect x="12" y="4" width="4" height="4" fill="currentColor" />
              <rect x="4" y="12" width="4" height="4" fill="currentColor" />
              <rect x="12" y="12" width="4" height="4" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">UniFlow</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Button
            variant="ghost"
            onClick={() => onTabChange("dashboard")}
            className={`relative text-sm sm:text-base ${
              activeTab === "dashboard"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            aria-current={activeTab === "dashboard" ? "page" : undefined}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => onTabChange("calendar")}
            className={`relative text-sm sm:text-base ${
              activeTab === "calendar"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            aria-current={activeTab === "calendar" ? "page" : undefined}
          >
            Calendar
          </Button>
        </nav>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="h-9 w-9"
        >
          {isDark ? (
            <Sun className="h-4 w-4 transition-transform hover:rotate-90" />
          ) : (
            <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
          )}
        </Button>
      </div>
    </header>
  )
}

