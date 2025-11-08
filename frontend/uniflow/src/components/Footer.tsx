import { Separator } from "@/components/ui/separator"
import { Github, Mail, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <svg
                    width="16"
                    height="16"
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
                <span className="font-semibold text-foreground">UniFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamline your academic workflow and stay organized.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Calendar
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Connect</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Visit our GitHub"
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Contact us via email"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Copyright */}
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} UniFlow. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

