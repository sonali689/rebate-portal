import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, FileText } from "lucide-react"

interface RequestDetailModalProps {
  isOpen: boolean
  onClose: () => void
  request: {
    id: number
    name: string
    rollNo: string
    fromDate: string
    toDate: string
    reason: string
    submittedOn: string
    status: string
    rejectionReason?: string
  } | null
}

export function RequestDetailModal({ isOpen, onClose, request }: RequestDetailModalProps) {
  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rebate Request Details</DialogTitle>
          <DialogDescription>
            Request #{request.id} submitted on {request.submittedOn}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Student</h4>
            <p>
              {request.name} ({request.rollNo})
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Date Range</h4>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {request.fromDate} to {request.toDate}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Reason</h4>
            <p>{request.reason}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Proof Document</h4>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" /> View Document
            </Button>
          </div>

          {request.status === "Rejected" && request.rejectionReason && (
            <div>
              <h4 className="text-sm font-medium">Rejection Reason</h4>
              <p>{request.rejectionReason}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
