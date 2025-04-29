import TheoryOfChangeBuilder from "@/components/theory-of-change-builder"
import { Navbar } from "@/components/navbar"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">
        <ErrorBoundary>
          <TheoryOfChangeBuilder />
        </ErrorBoundary>
      </div>
    </main>
  )
}
