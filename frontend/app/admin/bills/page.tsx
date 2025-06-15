"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Printer, Search, Calculator, Check, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillDetailModal } from "@/components/bill-detail-modal"
import { NotificationToast } from "@/components/notification-toast"
import Link from "next/link"

export default function MessBills() {
  const [selectedMonth, setSelectedMonth] = useState("01")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [searchQuery, setSearchQuery] = useState("")
  const [ratePerDay, setRatePerDay] = useState("81.30")
  const [estimatedAmount, setEstimatedAmount] = useState("80.00")
  const [activeTab, setActiveTab] = useState("prepare")
  const [showBillDetail, setShowBillDetail] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [billsGenerated, setBillsGenerated] = useState(false)
  const [rebateApplied, setRebateApplied] = useState(false)

  // Sample student data with rebate information
  const students = [
    {
      slNo: 1,
      roomNo: "C 721",
      rollNo: "210412",
      name: "SOWMYA",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 0 },
      extraMessing: 374,
    },
    {
      slNo: 2,
      roomNo: "C 705",
      rollNo: "210755",
      name: "SHUBHI VERMA",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 4 },
      extraMessing: 60,
    },
    {
      slNo: 3,
      roomNo: "D 332",
      rollNo: "210713",
      name: "RIYA VERMA",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 10 },
      extraMessing: 295,
    },
    {
      slNo: 4,
      roomNo: "D 307",
      rollNo: "210131",
      name: "ANISH CHANANIA",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 2 },
      extraMessing: 349,
    },
    {
      slNo: 5,
      roomNo: "C 102",
      rollNo: "210175",
      name: "APARNA KACHANI",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 1 },
      extraMessing: 95,
    },
    {
      slNo: 6,
      roomNo: "C 705",
      rollNo: "210273",
      name: "BHOOMI CHOUDHARY",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 0 },
      extraMessing: 430,
    },
    {
      slNo: 7,
      roomNo: "D 520",
      rollNo: "210293",
      name: "CHATLA SOWMYA SRI",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 4 },
      extraMessing: 1502,
    },
    {
      slNo: 8,
      roomNo: "D 332",
      rollNo: "210686",
      name: "POOJA CHOUDHARY",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 2 },
      extraMessing: 15,
    },
    {
      slNo: 9,
      roomNo: "C 102",
      rollNo: "210687",
      name: "POOJA MEENA",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 5 },
      extraMessing: 191,
    },
    {
      slNo: 10,
      roomNo: "C 406",
      rollNo: "210689",
      name: "Prabhdeep Kaur Sohal",
      totalDays: 31,
      rebateDays: { "90%": 0, "100%": 0 },
      extraMessing: 377,
    },
  ]

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery) ||
      student.roomNo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate bill details for each student
  const calculateBill = (student: (typeof students)[0]) => {
    const rate = Number.parseFloat(ratePerDay)
    const estAmount = Number.parseFloat(estimatedAmount)

    // Calculate effective bill days
    const effectiveDays = student.totalDays - (student.rebateDays["90%"] * 0.9 + student.rebateDays["100%"])

    // Calculate basic amount
    const basicAmount = effectiveDays * rate

    // Calculate total amount
    const totalAmount = basicAmount + student.extraMessing + estAmount

    return {
      effectiveDays: Math.round(effectiveDays),
      basicAmount: basicAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    }
  }

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

  const handleApplyRebates = () => {
    // In a real app, this would fetch rebate data from the database
    // and apply it to the bill calculations
    setRebateApplied(true)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleGenerateBills = () => {
    // In a real app, this would save the generated bills to the database
    setBillsGenerated(true)
    setActiveTab("view")
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleViewBill = (student: (typeof students)[0]) => {
    const bill = calculateBill(student)
    setSelectedBill({
      month: getMonthName(selectedMonth),
      year: selectedYear,
      amount: bill.totalAmount,
      status: "Unpaid",
      dueDate: `15/${(Number.parseInt(selectedMonth) + 1).toString().padStart(2, "0")}/${selectedYear}`,
      studentName: student.name,
      rollNo: student.rollNo,
      roomNo: student.roomNo,
      totalDays: student.totalDays,
      rebateDays: student.rebateDays,
      effectiveDays: bill.effectiveDays,
      ratePerDay: Number.parseFloat(ratePerDay),
      basicAmount: bill.basicAmount,
      extraMessing: student.extraMessing,
      estimatedAmount: Number.parseFloat(estimatedAmount),
    })
    setShowBillDetail(true)
  }

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Mess Bills</h1>
          <p className="text-gray-600">Generate and manage monthly mess bills</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline" className="back-button flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="prepare" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="prepare">Prepare Bills</TabsTrigger>
          <TabsTrigger value="view">View Bills</TabsTrigger>
          <TabsTrigger value="history">Bill History</TabsTrigger>
        </TabsList>

        <TabsContent value="prepare">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bill Generation</CardTitle>
              <CardDescription>Set parameters and apply rebates to generate bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month">
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

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ratePerDay">Rate Per Day (₹)</Label>
                  <Input id="ratePerDay" value={ratePerDay} onChange={(e) => setRatePerDay(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedAmount">Estimated Amount (₹)</Label>
                  <Input
                    id="estimatedAmount"
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between bg-sky-50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium">Step 1: Apply Rebates</h3>
                    <p className="text-sm text-gray-600">
                      Apply approved rebate days to student bills for {getMonthName(selectedMonth)} {selectedYear}
                    </p>
                  </div>
                  <Button className="bg-sky-500 hover:bg-sky-600" onClick={handleApplyRebates} disabled={rebateApplied}>
                    {rebateApplied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Rebates Applied
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" /> Apply Rebates
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between bg-sky-50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium">Step 2: Generate Bills</h3>
                    <p className="text-sm text-gray-600">
                      Generate final bills after applying rebates for {getMonthName(selectedMonth)} {selectedYear}
                    </p>
                  </div>
                  <Button
                    className="bg-sky-500 hover:bg-sky-600"
                    onClick={handleGenerateBills}
                    disabled={!rebateApplied || billsGenerated}
                  >
                    Generate Bills
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rebate Summary</CardTitle>
              <CardDescription>Overview of rebates to be applied for bill calculation</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader className="bg-sky-50">
                  <TableRow>
                    <TableHead className="text-center">Sl. No.</TableHead>
                    <TableHead className="text-center">Roll No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Total Days</TableHead>
                    <TableHead className="text-center" colSpan={2}>
                      Rebate Days
                    </TableHead>
                    <TableHead className="text-center">Effective Bill Days</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-center">90%</TableHead>
                    <TableHead className="text-center">100%</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const bill = calculateBill(student)
                    return (
                      <TableRow key={student.slNo}>
                        <TableCell className="text-center">{student.slNo}</TableCell>
                        <TableCell className="text-center">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center">{student.totalDays}</TableCell>
                        <TableCell className="text-center">{student.rebateDays["90%"] || "-"}</TableCell>
                        <TableCell className="text-center text-purple-600 font-medium">
                          {student.rebateDays["100%"] || "-"}
                        </TableCell>
                        <TableCell className="text-center font-medium">{bill.effectiveDays}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-sky-600">
              Mess Bill for {getMonthName(selectedMonth)} {selectedYear}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print All
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, roll number or room number..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader className="bg-sky-50">
                  <TableRow>
                    <TableHead className="text-center">Sl. No.</TableHead>
                    <TableHead className="text-center">Room No.</TableHead>
                    <TableHead className="text-center">Roll No.</TableHead>
                    <TableHead>Name of Students</TableHead>
                    <TableHead className="text-center">Total Days</TableHead>
                    <TableHead className="text-center" colSpan={2}>
                      Rebate Days
                    </TableHead>
                    <TableHead className="text-center">Effective Bill Days</TableHead>
                    <TableHead className="text-center">Rate Per Day</TableHead>
                    <TableHead className="text-center">Basic Amount</TableHead>
                    <TableHead className="text-center">Extra Messing</TableHead>
                    <TableHead className="text-center">Est. Amount</TableHead>
                    <TableHead className="text-center">Total Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-center">90%</TableHead>
                    <TableHead className="text-center">100%</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const bill = calculateBill(student)
                    return (
                      <TableRow key={student.slNo}>
                        <TableCell className="text-center">{student.slNo}</TableCell>
                        <TableCell className="text-center">{student.roomNo}</TableCell>
                        <TableCell className="text-center">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center">{student.totalDays}</TableCell>
                        <TableCell className="text-center">{student.rebateDays["90%"] || "-"}</TableCell>
                        <TableCell className="text-center text-purple-600 font-medium">
                          {student.rebateDays["100%"] || "-"}
                        </TableCell>
                        <TableCell className="text-center">{bill.effectiveDays}</TableCell>
                        <TableCell className="text-center">{ratePerDay}</TableCell>
                        <TableCell className="text-center">{bill.basicAmount}</TableCell>
                        <TableCell className="text-center text-purple-600 font-medium">
                          {student.extraMessing}
                        </TableCell>
                        <TableCell className="text-center">{estimatedAmount}</TableCell>
                        <TableCell className="text-center font-medium">{bill.totalAmount}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleViewBill(student)}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Bill</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Bill History</CardTitle>
              <CardDescription>View previously generated mess bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-gray-600">January 2024</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₹81,234.50</p>
                    <p className="text-sm text-gray-500 mt-1">Total amount for 120 students</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-gray-600">December 2023</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₹78,562.25</p>
                    <p className="text-sm text-gray-500 mt-1">Total amount for 118 students</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-gray-600">November 2023</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">₹80,125.75</p>
                    <p className="text-sm text-gray-500 mt-1">Total amount for 122 students</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
                  <div className="col-span-2">Month</div>
                  <div className="col-span-2">Year</div>
                  <div className="col-span-2">Total Amount</div>
                  <div className="col-span-2">Students</div>
                  <div className="col-span-2">Generated On</div>
                  <div className="col-span-2">Actions</div>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 border-b">
                  <div className="col-span-2">January</div>
                  <div className="col-span-2">2024</div>
                  <div className="col-span-2">₹81,234.50</div>
                  <div className="col-span-2">120</div>
                  <div className="col-span-2">01/02/2024</div>
                  <div className="col-span-2">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4 border-b">
                  <div className="col-span-2">December</div>
                  <div className="col-span-2">2023</div>
                  <div className="col-span-2">₹78,562.25</div>
                  <div className="col-span-2">118</div>
                  <div className="col-span-2">01/01/2024</div>
                  <div className="col-span-2">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-2">November</div>
                  <div className="col-span-2">2023</div>
                  <div className="col-span-2">₹80,125.75</div>
                  <div className="col-span-2">122</div>
                  <div className="col-span-2">01/12/2023</div>
                  <div className="col-span-2">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bill Detail Modal */}
      <BillDetailModal isOpen={showBillDetail} onClose={() => setShowBillDetail(false)} bill={selectedBill} />

      {/* Success Toast */}
      {showSuccessToast && (
        <NotificationToast
          type="success"
          title={rebateApplied && !billsGenerated ? "Rebates Applied" : "Bills Generated"}
          message={
            rebateApplied && !billsGenerated
              ? "Rebate days have been successfully applied to all student bills."
              : "Mess bills have been successfully generated for all students."
          }
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  )
}
