import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Dashboard } from "@/components/Dashboard"
import { CalendarPage } from "@/components/CalendarPage"

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar'>('dashboard')
  const [dashboardKey, setDashboardKey] = useState(0)

  // Reload Dashboard when switching to it
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setDashboardKey(prev => prev + 1)
    }
  }, [activeTab])

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 bg-background flex flex-col overflow-y-auto">
        {activeTab === "dashboard" ? (
          <Dashboard key={dashboardKey} />
        ) : (
          <CalendarPage />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
