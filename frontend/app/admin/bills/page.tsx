// src/pages/admin/bills.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ENABLE_BILL } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Printer, Search, Calculator, Check, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillDetailModal } from "@/components/bill-detail-modal"
import { NotificationToast} from "@/components/notification-toast"
import Link from "next/link"

export default function AdminBills() {
  const router = useRouter()

  // Redirect if billing feature is disabled
  useEffect(() => {
    if (!ENABLE_BILL) router.replace("/admin/dashboard")
  }, [router])

  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString().padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [ratePerDay, setRatePerDay] = useState<string>("")
  const [estimatedAmount, setEstimatedAmount] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("prepare")
  const [bills, setBills] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null)

  // Fetch initial data
  useEffect(() => {
  if (!ENABLE_BILL) {
    router.replace("/admin/dashboard")
    return
  }
    async function loadAdminData() {
      try {
        const [configRes, historyRes] = await Promise.all([
          fetch(`/api/admin/bills/config?month=${selectedMonth}&year=${selectedYear}`),
          fetch('/api/admin/bills/history')
        ])
        if (configRes.ok) {
          const cfg = await configRes.json()
          setRatePerDay(cfg.ratePerDay.toString())
          setEstimatedAmount(cfg.estimatedAmount.toString())
        }
        if (historyRes.ok) setHistory(await historyRes.json())
      } catch (error) {
        console.error("Error loading admin billing data:", error)
      }
    }
    loadAdminData()
  }, [selectedMonth, selectedYear])

  // Prepare view bills list
  useEffect(() => {
    if (activeTab === 'view') {
      fetch(`/api/admin/bills?month=${selectedMonth}&year=${selectedYear}`)
        .then(res => res.ok && res.json())
        .then(data => setBills(data || []))
        .catch(err => console.error(err))
    }
  }, [activeTab, selectedMonth, selectedYear])

  // Handlers
  const handleApplyRebates = async () => {
    await fetch(`/api/admin/bills/apply-rebates?month=${selectedMonth}&year=${selectedYear}`, { method: 'POST' })
    setToast({ type: 'success', message: 'Rebates applied' })
  }
  const handleGenerate = async () => {
    await fetch(`/api/admin/bills/generate?month=${selectedMonth}&year=${selectedYear}`, { method: 'POST' })
    setToast({ type: 'success', message: 'Bills generated' })
    setActiveTab('view')
  }
  const handleViewDetail = (bill: any) => {
    setSelectedBill(bill)
    setShowDetail(true)
  }

  const getMonthName = (m: string) => {
    const names = [ 'January','February','March','April','May','June','July','August','September','October','November','December' ]
    return names[Number(m)-1] || ''
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Mess Bills Admin</h1>
          <p className="text-gray-600">Generate and manage monthly mess bills</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline"><ArrowLeft /> Back</Button>
        </Link>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="prepare">
        <TabsList className="mb-6">
          <TabsTrigger value="prepare">Prepare</TabsTrigger>
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="prepare">
          <Card className="mb-6">
            <CardHeader><CardTitle>Configure & Rebates</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><Label>Month</Label><Select value={selectedMonth} onValueChange={setSelectedMonth}><SelectTrigger><SelectValue placeholder="Month"/></SelectTrigger><SelectContent>{Array.from({length:12},(_,i)=>{const m=(i+1).toString().padStart(2,'0');return <SelectItem key={m} value={m}>{getMonthName(m)}</SelectItem>})}</SelectContent></Select></div>
                <div><Label>Year</Label><Select value={selectedYear} onValueChange={setSelectedYear}><SelectTrigger><SelectValue placeholder="Year"/></SelectTrigger><SelectContent>{[2023,2024,2025].map(y=><SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Rate Per Day</Label><Input value={ratePerDay} onChange={e=>setRatePerDay(e.target.value)}/></div>
                <div><Label>Estimated Amount</Label><Input value={estimatedAmount} onChange={e=>setEstimatedAmount(e.target.value)}/></div>
              </div>
              <div className="mt-6 flex gap-4">
                <Button onClick={handleApplyRebates}><Calculator className="mr-2"/> Apply Rebates</Button>
                <Button onClick={handleGenerate}><Check className="mr-2"/> Generate Bills</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="view">
          <div className="mb-4 flex items-center gap-2">
            <Input placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
            <Search/>
          </div>
          <Card>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Roll No</TableHead><TableHead>Name</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>{bills.filter(b=>b.rollNo.includes(searchQuery)||b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((b,i)=><TableRow key={i}><TableCell>{b.rollNo}</TableCell><TableCell>{b.name}</TableCell><TableCell>{b.totalAmount}</TableCell><TableCell>{b.status}</TableCell><TableCell><Button variant="ghost" onClick={()=>handleViewDetail(b)}><FileText/></Button></TableCell></TableRow>)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle>History</CardTitle></CardHeader>
            <CardContent>
              {history.map((h,i)=><Card key={i} className="mb-4"><CardHeader><CardTitle>{getMonthName(h.month)} {h.year}</CardTitle></CardHeader><CardContent><p>Amount: ₹{h.totalAmount}</p><p>Generated: {h.generatedOn}</p><Button variant="outline" onClick={()=>handleViewDetail(h)}>View Details</Button></CardContent></Card>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <BillDetailModal isOpen={showDetail} onClose={()=>setShowDetail(false)} bill={selectedBill}/>
      {toast && <NotificationToast type={toast.type as "success" | "error" | "warning" | "info"} message={toast.message} onClose={()=>setToast(null)}/>}    
    </div>
  )
}

