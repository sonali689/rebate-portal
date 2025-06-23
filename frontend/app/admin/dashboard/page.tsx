"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Check, X } from "lucide-react";
import { RequestDetailModal } from "@/components/request-detail-modal";
import { RejectModal } from "@/components/reject-modal";
//import { DocumentViewerModal } from "@/components/document-viewer-modal";
import { NotificationToast } from "@/components/notification-toast";
import { UserNav } from "@/components/user-nav";
import { adminAPI } from "@/lib/api";

type RebateRequest = {
  id: number;
  name: string;
  roll_no: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: string;
  submitted_on: string;
  //document_url?: string;
  rejection_reason?: string | null;
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState<RebateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<RebateRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  //const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ type: string; title: string; message: string } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllRequests();
      console.log("🔥 adminAPI.getAllRequests returned:", data);
      setRequests(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (req: RebateRequest) => {
    setSelectedRequest(req);
    setShowDetailsModal(true);
  };

  //const handleViewDocument = (req: RebateRequest) => {
    //setSelectedRequest(req);
    //setShowDocumentModal(true);
  //};

  const handleApprove = async (req: RebateRequest) => {
    try {
      await adminAPI.approveRequest(req.id);
      setToastMessage({ type: "success", title: "Approved", message: `Request #${req.id} approved.` });
      fetchRequests();
    } catch (err: any) {
      console.error(err);
      setToastMessage({ type: "error", title: "Error", message: err.message || "Approve failed" });
    }
  };

  const handleReject = (req: RebateRequest) => {
    setSelectedRequest(req);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedRequest) return;
    try {
      await adminAPI.rejectRequest(selectedRequest.id, reason);
      setToastMessage({ type: "info", title: "Rejected", message: `Request #${selectedRequest.id} rejected.` });
      setShowRejectModal(false);
      fetchRequests();
    } catch (err: any) {
      console.error(err);
      setToastMessage({ type: "error", title: "Error", message: err.message || "Reject failed" });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-600">Admin Dashboard</h1>
        <UserNav isAdmin />
      </div>

      {loading && <p>Loading requests…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Pending Requests</h2>
          {requests.filter(r => r.status === "Pending").length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <div className="space-y-4">
              {requests.filter(r => r.status === "Pending").map(req => (
                <Card key={req.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{req.name}</h3>
                        <p className="text-gray-500">Roll No: {req.roll_no}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">Submitted on {req.submitted_on}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{req.from_date} to {req.to_date}</span>
                    </div>
                    <p className="mt-2"><strong>Reason:</strong> {req.reason}</p>
                    <div className="mt-4 flex gap-2">
                      {/*<Button variant="outline" onClick={() => handleViewDocument(req)}>
                        <FileText className="mr-1 h-4 w-4"/> Document
                      </Button>*/}
                      <Button variant="outline" onClick={() => handleViewDetails(req)}>
                        <FileText className="mr-1 h-4 w-4"/> Details
                      </Button>
                      <Button className="bg-green-600 text-white" onClick={() => handleApprove(req)}>
                        <Check className="mr-1 h-4 w-4"/> Approve
                      </Button>
                      <Button className="bg-red-600 text-white" onClick={() => handleReject(req)}>
                        <X className="mr-1 h-4 w-4"/> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-semibold mt-12">Processed Requests</h2>
          <div className="space-y-4">
            {requests.filter(r => r.status !== "Pending").map(req => (
              <Card key={req.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{req.name}</h3>
                      <p className="text-gray-500">Roll No: {req.roll_no}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">Submitted on {req.submitted_on}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{req.from_date} to {req.to_date}</span>
                  </div>
                  <p className="mt-2"><strong>Reason:</strong> {req.reason}</p>
                  {req.status === "Rejected" && req.rejection_reason && (
                    <p className="mt-2 text-red-600"><strong>Rejection Reason:</strong> {req.rejection_reason}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    {/*<Button variant="outline" onClick={() => handleViewDocument(req)}>
                      <FileText className="mr-1 h-4 w-4"/> Document
                    </Button>*/}
                    <Button variant="outline" onClick={() => handleViewDetails(req)}>
                      <FileText className="mr-1 h-4 w-4"/> Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          request={{
            id: selectedRequest.id,
            name: selectedRequest.name,
            rollNo: selectedRequest.roll_no,
            fromDate: selectedRequest.from_date,
            toDate: selectedRequest.to_date,
            reason: selectedRequest.reason,
            submittedOn: selectedRequest.submitted_on,
            status: selectedRequest.status,
            rejectionReason: selectedRequest.rejection_reason || undefined,
          }}
        />
      )}

      {selectedRequest && (
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          requestId={selectedRequest.id}
          onConfirm={handleRejectConfirm}
        />
      )}

      {/*{selectedRequest && (
        <DocumentViewerModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          documentUrl={selectedRequest.document_url || ""}
          studentName={selectedRequest.name}
        />
      )}*/}

      {toastMessage && (
        <NotificationToast
          type={toastMessage.type as "success" | "info" | "error"}
          title={toastMessage.title}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
