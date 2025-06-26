"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatMessage } from "@/components/chat-message"
import { DocumentViewer } from "@/components/document-viewer"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const documentId = searchParams.get("documentId")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentTitle, setDocumentTitle] = useState("Your Syllabus")
  const [documentContent, setDocumentContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch document details on load
  useEffect(() => {
    if (documentId) {
      fetchDocumentDetails(documentId)
    } else {
      // If no document ID, show a welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Welcome! Please upload a syllabus document to get started.",
          timestamp: new Date(),
        },
      ])
    }
  }, [documentId])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchDocumentDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`)
      if (!response.ok) throw new Error("Failed to fetch document")

      const data = await response.json()
      setDocumentTitle(data.name)
      setDocumentContent(data.content)

      // Add a welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `I've analyzed your syllabus "${data.name}". What would you like to know about this course?`,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error fetching document:", error)
      toast({
        title: "Error",
        description: "Failed to load document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get the backend URL at runtime from the window object
      const backendUrl = (typeof window !== "undefined" && window.env?.NEXT_PUBLIC_BACKEND_URL);

      if (!backendUrl) {
        throw new Error("Backend URL is not defined. Please check your environment variables configuration.");
      }

      // Prepare OpenAI-compatible messages array
      const chatMessages = [
        { role: "system", content: "You are a helpful study assistant. Answer questions based on the syllabus context provided." },
        { role: "user", content: userMessage.content }
      ]

      const response = await fetch(`${backendUrl}/v1/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct-AWQ",
          messages: chatMessages,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "[No response]",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center  items-center flex-col py-6">
      <h1 className="text-2xl font-bold mb-6">{documentTitle}</h1>

      <Tabs defaultValue="chat" className="w-[85%]">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  placeholder="Ask a question about your syllabus..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="document">
          <Card className="p-4">
            <DocumentViewer content={documentContent} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
