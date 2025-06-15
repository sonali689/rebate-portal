"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, FileText, Printer } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function StudentBills() {
  const [selectedMonth, setSelectedMonth] = useState("01")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [showBillDetails, setShowBillDetails] = useState(false)

  // Sample student data
  const student = {
    name: "Rahul Kumar",
    rollNo: "210345",
    roomNo: "D 332",
    totalDays: 31,
    rebateDays: { "90%": 0, "100%": 10 },
    extraMessing: 295,
    ratePerDay: 81.3,
    estimatedAmount: 80.0,
  }

  // Sample bill history
  const billHistory = [
    { month: "January", year: "2024", amount: "2082.25", status: "Paid", dueDate: "15/02/2024", paidOn: "10/02/2024" },
    { month: "December", year: "2023", amount: "2520.23", status: "Paid", dueDate: "15/01/2024", paidOn: "12/01/2024" },
    { month: "November", year: "2023", amount: "2438.93", status: "Paid", dueDate: "15/12/2023", paidOn: "10/12/2023" },
    { month: "October", year: "2023", amount: "2357.64", status: "Paid", dueDate: "15/11/2023", paidOn: "14/11/2023" },
  ]

  // Calculate bill details
  const calculateBill = () => {
    // Calculate effective bill days
    const effectiveDays = student.totalDays - (student.rebateDays["90%"] * 0.9 + student.rebateDays["100%"])

    // Calculate basic amount
    const basicAmount = effectiveDays * student.ratePerDay

    // Calculate total amount
    const totalAmount = basicAmount + student.extraMessing + student.estimatedAmount

    return {
      effectiveDays: Math.round(effectiveDays),
      basicAmount: basicAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    }
  }

  const bill = calculateBill()

  // Get month name from number
  const getMonthName = (monthNumber: string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[Number.parseInt(monthNumber) - 1]
  }

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">My Mess Bills</h1>
          <p className="text-gray-600">View and download your mess bills</p>
        </div>
        <Link href="/student/dashboard">
          <Button variant="outline" className="back-button flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Current Month Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₹{bill.totalAmount}</p>
            <p className="text-sm text-gray-500 mt-1">Due by 15th February, 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Rebate Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{student.rebateDays["100%"]}</p>
            <p className="text-sm text-gray-500 mt-1">Days of 100% rebate this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-600">Effective Bill Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{bill.effectiveDays}</p>
            <p className="text-sm text-gray-500 mt-1">Out of {student.totalDays} total days</p>
          </CardContent>
        </Card>
      </div>

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
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0")
                    return (
                      <SelectItem key={month} value={month}>
                        {getMonthName(month)}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-sky-500 hover:bg-sky-600 w-full sm:w-1/3" onClick={() => setShowBillDetails(true)}>
              View Bill
            </Button>
          </div>
        </CardContent>
      </Card>

      {showBillDetails && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mess Bill Details</CardTitle>
              <CardDescription>
                {getMonthName(selectedMonth)} {selectedYear}
              </CardDescription>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Student Details</h3>
                  <p className="text-sm text-gray-600">Name: {student.name}</p>
                  <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                  <p className="text-sm text-gray-600">Room No: {student.roomNo}</p>
                </div>
                <div>
                  <h3 className="font-medium">Bill Details</h3>
                  <p className="text-sm text-gray-600">
                    Bill Period: 01/{selectedMonth}/{selectedYear} to 31/{selectedMonth}/{selectedYear}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due Date: 15/{Number.parseInt(selectedMonth) + 1}/{selectedYear}
                  </p>
                  <p className="text-sm text-gray-600">Status: Unpaid</p>
                </div>
              </div>

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
                      Basic Mess Charges ({bill.effectiveDays} days × ₹{student.ratePerDay})
                    </TableCell>
                    <TableCell className="text-right">{bill.basicAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Extra Messing Charges</TableCell>
                    <TableCell className="text-right">{student.extraMessing.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Estimated Amount</TableCell>
                    <TableCell className="text-right">{student.estimatedAmount.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Amount</TableCell>
                    <TableCell className="text-right font-medium">{bill.totalAmount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

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
                      <TableCell className="text-center">{student.totalDays}</TableCell>
                      <TableCell className="text-center">{student.rebateDays["90%"] || "-"}</TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">
                        {student.rebateDays["100%"] || "-"}
                      </TableCell>
                      <TableCell className="text-center">{bill.effectiveDays}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
          <CardDescription>View your previous mess bills</CardDescription>
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
              {billHistory.map((bill, index) => (
                <TableRow key={index}>
                  <TableCell>{bill.month}</TableCell>
                  <TableCell>{bill.year}</TableCell>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">{bill.status}</span>
                  </TableCell>
                  <TableCell>{bill.paidOn}</TableCell>
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
