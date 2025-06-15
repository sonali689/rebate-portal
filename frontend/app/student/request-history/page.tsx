"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RequestDetailModal } from "@/components/request-detail-modal"
import Link from "next/link"
import { studentAPI } from "@/lib/api"

export default function RequestHistory() {
  const [activeTab, setActiveTab] = useState<"all"|"pending"|"approved"|"rejected">("all")
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Fetch all requests for this student
  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const res = await studentAPI.getRebateRequests()
      setRequests(res.data)
    } catch (err) {
      console.error("Failed to load requests", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Filter requests per tab
  const filteredRequests = activeTab === "all"
    ? requests
    : requests.filter(r => r.status.toLowerCase() === activeTab)

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  // Helper to compute inclusive days
  const calculateDays = (fromDate: string, toDate: string): number => {
    const start = new Date(fromDate)
    const end = new Date(toDate)
    const diffMs = end.getTime() - start.getTime()
    return Math.floor(diffMs / (1000*60*60*24)) + 1
  }

  // When modal closes, no need to re-fetch unless status might have changed:
  const handleClose = () => {
    setShowDetailsModal(false)
    fetchRequests()
  }

  return (
    <div className="p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Request History</h1>
          <p className="text-gray-600">View and track all your rebate requests</p>
        </div>
        <Link href="/student/dashboard">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={(val: string) => setActiveTab(val as "all" | "pending" | "approved" | "rejected")}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <p>Loading...</p>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No requests found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">Rebate Request #{request.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : request.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-gray-500">Submitted on {new Date(request.created_at).toLocaleDateString()}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{request.start_date} to {request.end_date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Duration: {calculateDays(request.start_date, request.end_date)} days</span>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Reason:</p>
                      <p>{request.reason}</p>
                    </div>

                    {request.status === "Rejected" && request.admin_remarks && (
                      <div className="mt-2 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-gray-600">Rejection Reason:</p>
                        <p className="text-red-600">{request.admin_remarks}</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={() => handleViewDetails(request)}>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RequestDetailModal
        isOpen={showDetailsModal}
        onClose={handleClose}
        request={selectedRequest}
      />
    </div>
  )
}
