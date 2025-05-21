import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b flex justify-center items-center">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>SyllabusAI</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/upload" className="text-sm font-medium">
              Upload
            </Link>
            <Link href="/chat" className="text-sm font-medium">
              Chat
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Study Smarter with Your Syllabus AI
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Upload your course syllabus and get personalized study assistance, topic explanations, and answers
                    to your questions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/upload">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Syllabus AI"
                  className="rounded-lg object-cover"
                  height="400"
                  src="/placeholder.svg?height=400&width=500"
                  style={{
                    aspectRatio: "500/400",
                    objectFit: "cover",
                  }}
                  width="500"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform uses AI to analyze your syllabus and provide personalized study assistance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">1. Upload Your Syllabus</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Simply upload your course syllabus document to our platform.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">2. AI Processes Content</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI analyzes the syllabus to understand course topics, requirements, and structure.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">3. Chat and Learn</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Ask questions about your course, get explanations, and receive study guidance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} SyllabusAI. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm font-medium" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
