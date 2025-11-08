import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Main content will go here */}
      </main>
      <Footer />
    </div>
  )
}

export default App