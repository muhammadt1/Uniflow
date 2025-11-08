export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 sm:py-4">
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

