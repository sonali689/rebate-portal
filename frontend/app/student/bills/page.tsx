// src/pages/student/bills.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ENABLE_BILL } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, FileText, Printer } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function StudentBills() {
  const router = useRouter()

  // Redirect if billing feature is disabled
  useEffect(() => {
    if (!ENABLE_BILL) {
      router.replace("/student/dashboard")
    }
  }, [router])

  // State
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString().padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [showBillDetails, setShowBillDetails] = useState<boolean>(false)
  const [studentData, setStudentData] = useState<any>(null)
  const [billHistory, setBillHistory] = useState<any[]>([])
  const [currentBill, setCurrentBill] = useState<any>(null)

  // Fetch data from backend
  useEffect(() => {
  if (!ENABLE_BILL) {
    router.replace("/student/dashboard")
    return
  }
    async function loadData() {
      try {
        const [infoRes, historyRes, currentRes] = await Promise.all([
          fetch('/api/student/info'),
          fetch('/api/student/bills/history'),
          fetch('/api/student/bills/current'),
        ])
        if (infoRes.ok) setStudentData(await infoRes.json())
        if (historyRes.ok) setBillHistory(await historyRes.json())
        if (currentRes.ok) setCurrentBill(await currentRes.json())
      } catch (error) {
        console.error("Error loading billing data:", error)
      }
    }
    loadData()
  }, [])

  // Calculate bill if no current bill endpoint
  const calculateBill = () => {
    if (!studentData) return { effectiveDays: 0, basicAmount: '0.00', totalAmount: '0.00' }
    const { totalDays, rebateDays, extraMessing, ratePerDay, estimatedAmount } = studentData
    const effectiveDays = Math.round(
      totalDays - ((rebateDays['90%'] || 0) * 0.9 + (rebateDays['100%'] || 0))
    )
    const basicAmount = (effectiveDays * ratePerDay).toFixed(2)
    const totalAmount = (
      parseFloat(basicAmount) + extraMessing + estimatedAmount
    ).toFixed(2)
    return { effectiveDays, basicAmount, totalAmount }
  }

  const bill = currentBill || calculateBill()

  const getMonthName = (monthNumber: string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    const idx = Number.parseInt(monthNumber) - 1
    return months[idx] || ''
  }

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">My Mess Bills</h1>
          <p className="text-gray-600">View and download your mess bills</p>
        </div>
        <Link href="/student/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentBill && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-600">Current Month Bill</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₹{bill.totalAmount}</p>
              <p className="text-sm text-gray-500 mt-1">Due by {currentBill.dueDate}</p>
            </CardContent>
          </Card>
        )}
        {studentData && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Rebate Days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{studentData.rebateDays['100%'] || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Days of 100% rebate this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Effective Bill Days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{bill.effectiveDays}</p>
                <p className="text-sm text-gray-500 mt-1">Out of {studentData.totalDays} total days</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* View Bill Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>View Bill</CardTitle>
          <CardDescription>Select month and year to view bill details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = (i + 1).toString().padStart(2, '0')
                    return <SelectItem key={m} value={m}>{getMonthName(m)}</SelectItem>
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025].map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="bg-sky-500 hover:bg-sky-600 w-full sm:w-1/3 text-white"
              onClick={() => setShowBillDetails(true)}
            >
              View Bill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bill Details */}
      {showBillDetails && (
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Mess Bill Details</CardTitle>
              <CardDescription>{getMonthName(selectedMonth)} {selectedYear}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Student & Bill Period Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Student Details</h3>
                  <p className="text-sm text-gray-600">Name: {studentData?.name}</p>
                  <p className="text-sm text-gray-600">Roll No: {studentData?.rollNo}</p>
                  <p className="text-sm text-gray-600">Room No: {studentData?.roomNo}</p>
                </div>
                <div>
                  <h3 className="font-medium">Bill Details</h3>
                  <p className="text-sm text-gray-600">Period: 01/{selectedMonth}/{selectedYear} to {studentData?.totalDays}/{selectedMonth}/{selectedYear}</p>
                  <p className="text-sm text-gray-600">Due Date: {currentBill?.dueDate || `15/${(Number(selectedMonth)%12)+1}/${selectedYear}`}</p>
                  <p className="text-sm text-gray-600">Status: {currentBill?.status || 'Unpaid'}</p>
                </div>
              </div>

              {/* Charges Table */}
              <Table>
                <TableHeader className="bg-sky-50">
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Basic Charges ({bill.effectiveDays} days × ₹{studentData?.ratePerDay})</TableCell>
                    <TableCell className="text-right">{bill.basicAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Extra Charges</TableCell>
                    <TableCell className="text-right">{studentData?.extraMessing?.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Estimated Amount</TableCell>
                    <TableCell className="text-right">{studentData?.estimatedAmount?.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Amount</TableCell>
                    <TableCell className="text-right font-medium">{bill.totalAmount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Rebate Details */}
              <div>
                <h3 className="font-medium mb-2">Rebate Details</h3>
                <Table>
                  <TableHeader className="bg-sky-50">
                    <TableRow>
                      <TableHead>Total Days</TableHead>
                      <TableHead>90% Rebate</TableHead>
                      <TableHead>100% Rebate</TableHead>
                      <TableHead>Effective Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center">{studentData?.totalDays}</TableCell>
                      <TableCell className="text-center">{studentData?.rebateDays['90%'] || 0}</TableCell>
                      <TableCell className="text-center">{studentData?.rebateDays['100%'] || 0}</TableCell>
                      <TableCell className="text-center">{bill.effectiveDays}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bill History */}
      <Card>
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
          <CardDescription>Previous mess bills</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-sky-50">
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billHistory.map((b, i) => (
                <TableRow key={i}>
                  <TableCell>{b.month}</TableCell>
                  <TableCell>{b.year}</TableCell>
                  <TableCell>{b.amount}</TableCell>
                  <TableCell>{b.dueDate}</TableCell>
                  <TableCell>{b.status}</TableCell>
                  <TableCell>{b.paidOn || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
