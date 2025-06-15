import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Printer } from "lucide-react"

interface BillDetailModalProps {
  isOpen: boolean
  onClose: () => void
  bill: {
    month: string
    year: string
    amount: string
    status: string
    dueDate: string
    paidOn?: string
    studentName: string
    rollNo: string
    roomNo: string
    totalDays: number
    rebateDays: { "90%": number; "100%": number }
    effectiveDays: number
    ratePerDay: number
    basicAmount: string
    extraMessing: number
    estimatedAmount: number
  } | null
}

export function BillDetailModal({ isOpen, onClose, bill }: BillDetailModalProps) {
  if (!bill) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mess Bill Details</DialogTitle>
          <DialogDescription>
            {bill.month} {bill.year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Student Details</h3>
              <p className="text-sm text-gray-600">Name: {bill.studentName}</p>
              <p className="text-sm text-gray-600">Roll No: {bill.rollNo}</p>
              <p className="text-sm text-gray-600">Room No: {bill.roomNo}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Bill Details</h3>
            <Table>
              <TableHeader className="bg-sky-50">
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Basic Mess Charges ({bill.effectiveDays} days × ₹{bill.ratePerDay})
                  </TableCell>
                  <TableCell className="text-right">{bill.basicAmount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Extra Messing Charges</TableCell>
                  <TableCell className="text-right">{bill.extraMessing.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estimated Amount</TableCell>
                  <TableCell className="text-right">{bill.estimatedAmount.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Amount</TableCell>
                  <TableCell className="text-right font-medium">{bill.amount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="font-medium mb-2">Rebate Details</h3>
            <Table>
              <TableHeader className="bg-sky-50">
                <TableRow>
                  <TableHead>Total Days</TableHead>
                  <TableHead>90% Rebate Days</TableHead>
                  <TableHead>100% Rebate Days</TableHead>
                  <TableHead>Effective Bill Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center">{bill.totalDays}</TableCell>
                  <TableCell className="text-center">{bill.rebateDays["90%"] || "-"}</TableCell>
                  <TableCell className="text-center text-purple-600 font-medium">
                    {bill.rebateDays["100%"] || "-"}
                  </TableCell>
                  <TableCell className="text-center">{bill.effectiveDays}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className={bill.status === "Paid" ? "text-green-600" : "text-yellow-600"}>{bill.status}</span>
                </p>
                <p className="text-sm text-gray-600">Due Date: {bill.dueDate}</p>
              </div>
              {bill.status === "Paid" && bill.paidOn && (
                <div>
                  <p className="text-sm text-gray-600">Paid On: {bill.paidOn}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
