"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Plus, Receipt } from "lucide-react";
import { RequestDetailModal } from "@/components/request-detail-modal";
import { UserNav } from "@/components/user-nav";
import { authAPI, studentAPI } from "@/lib/api";
import { ENABLE_BILL } from "@/lib/utils";
import Image from "next/image";

interface UserData {
  name?: string;
  rollNo?: string;
  totalBill?: string;
  currentBill?: string;
}

interface RebateRequest {
  id: number;
  name: string;
  rollNo: string;
  fromDate: string;
  toDate: string;
  reason: string;
  submittedOn: string;
  status: string;
  rejectionReason?: string;
  // Keep backend field names for compatibility
  created_at?: string;
  start_date?: string;
  end_date?: string;
}

interface Summary {
  total: number;
  pending: number;
  approved: number;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RebateRequest | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [requests, setRequests] = useState<RebateRequest[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch current user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authAPI.getCurrentUser();
        setUserData(data);
        console.log("Fetched userData:", data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch summary & requests (token identifies student)
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: sumData }, { data: reqData }] = await Promise.all([
        studentAPI.getRebateSummary(),
        studentAPI.getRebateRequests(),
      ]);

      console.log("✅ Rebate Summary Response:", sumData);

      setSummary({
        total: sumData.total,
        pending: sumData.pending,
        approved: sumData.approved,
      });
      
      // Transform backend data to match modal expectations
      const transformedRequests = reqData.map((req: any) => ({
        id: req.id,
        name: req.name || userData?.name || "N/A",
        rollNo: req.rollNo || userData?.rollNo || "N/A",
        fromDate: req.start_date || req.fromDate,
        toDate: req.end_date || req.toDate,
        reason: req.reason,
        submittedOn: req.created_at || req.submittedOn,
        status: req.status,
        rejectionReason: req.rejectionReason,
        // Keep original fields for backward compatibility
        created_at: req.created_at,
        start_date: req.start_date,
        end_date: req.end_date,
      }));
      
      setRequests(transformedRequests);
    } catch (err) {
      console.error("Failed to fetch rebate data", err);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchData();
    }
  }, [userData, fetchData]);

  const handleView = (request: RebateRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  // Show 2 most recent requests
  const recentRequests = requests.slice(-2).reverse();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Student Dashboard</h1>
          <p className="text-gray-600">Manage your mess rebate applications</p>
        </div>
        <UserNav />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apply">Apply for Rebate</TabsTrigger>
          <TabsTrigger value="history">Rebate History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Total Rebates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{summary.total ?? 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{summary.pending ?? 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Approved Rebates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{summary.approved ?? 0}</p>
              </CardContent>
            </Card>

            {ENABLE_BILL && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Total Bill</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {userData?.totalBill ?? "₹0.00"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Current Bill Card */}
          {ENABLE_BILL && (
            <div className="mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-600">Current Bill</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {userData?.currentBill ?? "₹0.00"}
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sky-600"
                    onClick={() => router.push("/student/bills")}
                  >
                    <Receipt className="h-4 w-4 mr-1" /> View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Requests Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-sky-600">Recent Requests</h2>
            <Button
              onClick={() => router.push("/student/apply-rebate")}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recentRequests.length > 0 ? (
                recentRequests.map((request, index) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">Rebate #{index + 1}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="text-gray-500 mb-2">
                        Submitted on{" "}
                        {new Date(request.submittedOn || request.created_at || '').toLocaleDateString()}
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {request.fromDate || request.start_date} to {request.toDate || request.end_date}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Reason:</p>
                        <p className="text-sm">{request.reason}</p>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleView(request)}
                        >
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No requests found</p>
                  <Button
                    onClick={() => router.push("/student/apply-rebate")}
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Request
                  </Button>
                </div>
              )}

              {recentRequests.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/student/request-history")}
                  >
                    View All Requests
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Apply Tab */}
        <TabsContent value="apply">
          <div className="flex justify-center">
            <Card className="w-full max-w-3xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-sky-600 mb-4">
                  Apply for Rebate
                </h2>
                <p className="mb-6 text-gray-600">
                  Click the button below to submit a new rebate application.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => router.push("/student/apply-rebate")}
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Apply for Rebate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="flex justify-center">
            <Card className="w-full max-w-4xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-sky-600 mb-4">
                  Rebate History
                </h2>
                <p className="mb-6 text-gray-600">
                  View all your previous rebate requests and their status.
                </p>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((request, index) => (
                      <Card key={request.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">
                              Rebate #{requests.length - index}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </div>

                          <p className="text-gray-500 mb-2">
                            Submitted on{" "}
                            {new Date(request.submittedOn || request.created_at || '').toLocaleDateString()}
                          </p>

                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              {request.fromDate || request.start_date} to {request.toDate || request.end_date}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Reason:</p>
                            <p className="text-sm">{request.reason}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No rebate requests found</p>
                    <Button
                      onClick={() => router.push("/student/apply-rebate")}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Apply for Your First Rebate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Detail Modal */}
      <RequestDetailModal
        isOpen={showDetails}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  );
}




