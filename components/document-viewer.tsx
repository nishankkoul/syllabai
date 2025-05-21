import { Card, CardContent } from "@/components/ui/card"

interface DocumentViewerProps {
  content: string
}

export function DocumentViewer({ content }: DocumentViewerProps) {
  if (!content) {
    return <div className="flex items-center justify-center h-[60vh] text-gray-500">No document content available</div>
  }

  return (
    <Card className="h-[60vh] overflow-y-auto">
      <CardContent className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          {content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
