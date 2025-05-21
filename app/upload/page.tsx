"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { toast } from "@/components/ui/use-toast"
import { Upload, Loader2 } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState("")

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      // Default document name to file name without extension
      setDocumentName(selectedFile.name.split(".")[0])
    } else {
      setFile(null)
      setFileName("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!file) {
    toast({
      title: "No file selected",
      description: "Please select a file to upload.",
      variant: "destructive",
    })
    return
  }

  if (!documentName.trim()) {
    toast({
      title: "Document name required",
      description: "Please provide a name for your document.",
      variant: "destructive",
    })
    return
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (fileExtension !== 'pdf') {
    toast({
      title: "Unsupported file type",
      description: "Only PDF files are supported.",
      variant: "destructive",
    })
    return
  }

  const MAX_SIZE = 50 * 1024 * 1024 // 50MB
  if (file.size > MAX_SIZE) {
    toast({
      title: "File too large",
      description: "PDF must be under 50MB.",
      variant: "destructive",
    })
    return
  }

  setIsUploading(true)

  try {
    // Step 1: Send PDF to /upload API to extract text
    const pdfFormData = new FormData()
    pdfFormData.append("file", file)

    const extractResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
      method: "POST",
      body: pdfFormData,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    })

    const contentType = extractResponse.headers.get("content-type")
    const rawText = await extractResponse.text()

    if (!extractResponse.ok) {
      console.error("PDF extraction failed:", rawText)
      throw new Error("Failed to extract text from PDF")
    }

    let text: string
    try {
      if (contentType?.includes("application/json")) {
        const json = JSON.parse(rawText)
        text = json.text
      } else {
        console.error("Unexpected response content-type:", contentType)
        throw new Error("Expected JSON response from /upload")
      }
    } catch (jsonParseError) {
      console.error("Error parsing /upload response as JSON:", jsonParseError)
      throw jsonParseError
    }

    // // Step 2: Upload document with extracted text
    // const documentPayload = {
    //   content: text,
    //   fileName: file.name,
    //   fileType: file.type,
    //   fileSize: file.size,
    //   lastModified: file.lastModified,
    //   name: documentName.trim(),
    // }
    const documentPayload = {
      documents: [
        {
          content: text,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          lastModified: file.lastModified,
          name: documentName.trim(),
        },
      ],
      source: "user-upload", // or any identifier you want for the source
      context_type: "resource", // or "conversation" / "instruction" depending on use-case
    }

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/context/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify(documentPayload),
    })

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text()
      console.error("Context upload failed:", errorBody)
      throw new Error("Failed to upload document")
    }

    const data = await uploadResponse.json()

    console.log("THE DATA", data)

    toast({
      title: "Document uploaded successfully",
      description: "Your syllabus has been processed and is ready for use.",
    })

    router.push(`/chat`)
  } catch (error) {
    console.error("Upload error:", error)
    toast({
      title: "Upload failed",
      description: "There was an error uploading your document. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsUploading(false)
  }
}


  return (
    <div className="w-full flex justify-center  items-center flex-col py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Your Syllabus</h1>
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Upload your syllabus document to get started. We support PDF, DOCX, and TXT files.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name</Label>
              <Input
                id="documentName"
                placeholder="Enter a name for your document"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Upload File</Label>
              <FileUpload onFileSelected={handleFileChange} fileName={fileName} />
              <p className="text-sm text-gray-500">Maximum file size: 10MB. Supported formats: PDF, DOCX, TXT</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isUploading || !file}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
