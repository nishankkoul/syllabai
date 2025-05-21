import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Simulated in-memory storage (shared with document routes)
// In a real application, you would import your database client here
const documents = new Map()

export async function POST(req: NextRequest) {
  try {
    const { prompt, documentId } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    if (!documentId) {
      return NextResponse.json({ error: "No document ID provided" }, { status: 400 })
    }

    // Fetch the document content
    // In a real application, you would fetch from your database
    const document = documents.get(documentId)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Generate a response using the AI SDK
    const { text, usage } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a helpful study assistant that helps students understand their course syllabus. 
      Use the following syllabus content as your knowledge base. 
      Only answer questions related to this specific course syllabus.
      If asked about something not in the syllabus, politely explain that information isn't in the document.
      
      SYLLABUS CONTENT:
      ${document.content}`,
      prompt,
    })

    // Calculate a relevance rating (1-10) based on how well the response addresses the query
    // In a real application, you might use a more sophisticated approach
    const relevanceRating = Math.floor(Math.random() * 3) + 8 // Random rating between 8-10 for demo

    return NextResponse.json({
      text,
      relevanceRating,
      usage: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
      },
    })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
