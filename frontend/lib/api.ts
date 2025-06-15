const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to get the stored token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

// Handle HTTP responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
    console.error("API Error:", errorData.message || response.statusText);
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentAdmin");
      window.location.href = "/login/admin";
    }
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return { data: await response.json() };
};

// Generic fetch wrapper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  return handleResponse(response);
};

// Auth API (students + admins)
export const authAPI = {
  // Student login
  login: (email: string, rollNumber?: string) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, roll_number: rollNumber }),
    }),

  // Admin login (email only)
  adminLogin: (email: string) =>
    apiCall("/api/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Verify OTP (students)
  verifyOTP: (email: string, otpCode: string) =>
    apiCall("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp_code: otpCode }),
    }),

  // Verify OTP (admins)
  adminVerifyOTP: (email: string, otpCode: string) =>
    apiCall("/api/auth/admin-verify", {
      method: "POST",
      body: JSON.stringify({ email, otp_code: otpCode }),
    }),

  getCurrentUser: () => apiCall("/api/auth/me"),
};

// Student API
export const studentAPI = {
  getProfile: () => apiCall("/api/students/profile"),
  updateProfile: (data: any) =>
    apiCall("/api/students/profile", { method: "PUT", body: JSON.stringify(data) }),
  createRebateRequest: (data: any) =>
    apiCall("/api/students/rebate-requests", { method: "POST", body: JSON.stringify(data) }),
  // ⬅️ Simplified: backend infers student from token
  getRebateRequests: () => apiCall("/api/students/rebate-requests"),
  getRebateSummary: () => apiCall("/api/students/rebate-summary"),
  uploadDocument: async (requestId: number, file: File) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(
      `${API_BASE_URL}/api/students/rebate-requests/${requestId}/upload-document`,
      { method: "POST", headers, body: formData }
    );
    return handleResponse(response);
  },
  getMessBills: () => apiCall("/api/students/mess-bills"),
};

// Admin API
export const adminAPI = {
  // Fetch all students with summary
  getStudents: () => apiCall("/api/admin/students"),

  // Fetch one student’s requests
  getStudentRequests: (studentId: number) =>
    apiCall(`/api/admin/students/${studentId}/rebate-requests`),

  // Fetch all rebate requests
  getAllRequests: (statusFilter?: string) => {
    const params = statusFilter ? `?status_filter=${statusFilter}` : "";
    return apiCall(`/api/admin/rebate-requests${params}`);
  },

  // Update rebate request (approve/reject)
  updateRebateRequest: (requestId: number, data: any) =>
    apiCall(`/api/admin/rebate-requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Approve a request
  approveRequest: (requestId: number) =>
    apiCall(`/api/admin/rebate-requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "approved" }),
    }),

  // Reject a request with remarks
  rejectRequest: (requestId: number, remarks: string) =>
    apiCall(`/api/admin/rebate-requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "rejected", admin_remarks: remarks }),
    }),

  // Dashboard stats
  getDashboardStats: () => apiCall("/api/admin/dashboard-stats"),

  // Create mess bill
  createMessBill: (data: any) =>
    apiCall("/api/admin/mess-bills", { method: "POST", body: JSON.stringify(data) }),
};

export default { authAPI, studentAPI, adminAPI };
