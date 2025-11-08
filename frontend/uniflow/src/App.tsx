import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Calendar18 } from "@/components/Calendar18"

function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar">("dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden min-h-0">
        {activeTab === "calendar" && (
          <div className="flex items-center justify-center w-full h-full p-3 sm:p-4 lg:p-6">
            <div className="w-full max-w-3xl">
              <Calendar18 />
            </div>
          </div>
        )}
        {activeTab === "dashboard" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Dashboard content coming soon...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App