"\"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  documentUrl?: string
  studentName?: string
}

export function DocumentViewerModal({ isOpen, onClose, documentUrl, studentName }: DocumentViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Document for {studentName}</DialogTitle>
        </DialogHeader>
        {documentUrl ? <iframe src={documentUrl} width="100%" height="500px" /> : <p>No document to display.</p>}
      </DialogContent>
    </Dialog>
  )
}
