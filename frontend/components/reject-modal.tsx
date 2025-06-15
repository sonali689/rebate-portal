"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export interface RejectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  requestId: any
}

export function RejectModal({ isOpen, onClose, onConfirm, requestId }: RejectModalProps) {
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    onConfirm(reason)
    setReason("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Rebate Request</DialogTitle>
          <DialogDescription>Please provide a reason for rejecting this request.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="rejectionReason" className="text-sm font-medium">
              Rejection Reason
            </label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter reason for rejection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason.trim()}>
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
