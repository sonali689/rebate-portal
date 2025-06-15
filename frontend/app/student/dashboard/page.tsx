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
import Image from "next/image"
export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const [userData, setUserData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch current user from backend
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

  // 2️⃣ Fetch summary & requests (token identifies student)
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
      setRequests(reqData);
    } catch (err) {
      console.error("Failed to fetch rebate data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      fetchData();
    }
  }, [userData, fetchData]);

  const handleView = (r: any) => {
    setSelectedRequest(r);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    fetchData();
  };

  // show 2 most recent
  const recent = requests.slice(-2).reverse();

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Student Dashboard</h1>
          <p className="text-gray-600">Manage your mess rebate applications</p>
        </div>
        <UserNav />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apply">Apply for Rebate</TabsTrigger>
          <TabsTrigger value="history">Rebate History</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Total Rebates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{summary.total??0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{summary.pending??0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600">Approved Rebates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{summary.approved??0}</p>
              </CardContent>
            </Card>
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
            <p>Loading...</p>
          ) : (
            <div className="space-y-6">
              {recent.map((r, index) => (
                <Card key={r.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">Rebate #{index+1}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          r.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-gray-500">
                      Submitted on{" "}
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {r.start_date} to {r.end_date}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Reason:</p>
                      <p>{r.reason}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" onClick={() => handleView(r)}>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/student/request-history")}
                >
                  View All Requests
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Apply Tab */}
        <TabsContent value="apply">
          <div className="flex justify-center">
            <Card className="w-full max-w-3xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-sky-600 mb-4">
                  Apply for Rebate
                </h2>
                <p className="mb-6 text-gray-600">
                  Click the button below to submit a new rebate.
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
            <Card className="w-full max-w-3xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-sky-600 mb-4">
                  Rebate History
                </h2>
                <p className="mb-6 text-gray-600">
                  All your previous rebate requests.
                </p>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  requests.map((r, index) => (
                    <Card key={r.id} className="mb-4">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold">Rebate #{index + 1}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              r.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : r.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-gray-500">
                          Submitted on{" "}
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            {r.start_date} to {r.end_date}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Reason:</p>
                          <p>{r.reason}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <RequestDetailModal
        isOpen={showDetails}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  );
}




