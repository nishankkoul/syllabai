"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Document = {
  id: string
  name: string
  uploadedAt: string
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      // In a real application, you would fetch from your API
      // For this template, we'll simulate with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockDocuments = [
        {
          id: "1",
          name: "CS101 Introduction to Computer Science",
          uploadedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "MATH201 Linear Algebra",
          uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ]

      setDocuments(mockDocuments)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to load your documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // In a real application, you would call your API to delete the document
      // For this template, we'll just update the state
      setDocuments(documents.filter((doc) => doc.id !== id))

      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
    <div className="py-8 w-[80%]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Documents</h1>
        <Link href="/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        </Link>
      </div>

      <div className="w-full flex justify-start items-center">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-gray-100 dark:bg-gray-800 h-24" />
              <CardContent className="h-20 mt-4">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="pt-6 flex flex-col items-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-4">Upload your first syllabus to get started</p>
            <Link href="/upload">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="truncate">{doc.name}</CardTitle>
                <CardDescription>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Syllabus Document</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/chat?documentId=${doc.id}`}>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      </div>
      
    </div>
    </div>
  )
}
