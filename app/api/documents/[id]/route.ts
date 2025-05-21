import { type NextRequest, NextResponse } from "next/server"

// This would typically connect to a database
// For this template, we'll use the in-memory storage from the upload route
// In a real application, you would import your database client here

// Simulated in-memory storage (shared with upload route)
const documents = new Map()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real application, you would fetch from your database
    const document = documents.get(id)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}
