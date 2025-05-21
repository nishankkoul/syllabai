"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileSelected: (file: File | null) => void
  fileName?: string
}

export function FileUpload({ onFileSelected, fileName }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    onFileSelected(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="relative">
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".pdf,.docx,.doc,.txt" />

      {fileName ? (
        <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <span className="text-sm truncate max-w-[80%]">{fileName}</span>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleClick}>
              Change
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">Drag and drop your file here or click to browse</p>
          <p className="text-xs text-gray-500">PDF, DOCX, or TXT files up to 10MB</p>
        </div>
      )}
    </div>
  )
}
