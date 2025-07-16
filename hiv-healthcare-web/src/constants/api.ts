// api.ts

export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
// export const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // ===== USER =====
  SIGNUP: "/users",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  VERIFY_OTP: "/users/verify-otp",
  RESEND_OTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  VERIFY_RESET_OTP: "/users/verify-reset-otp",
  RESET_PASSWORD: "/users/reset-password",
  GET_ALL_USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,
  GET_WORK_SCHEDULE: (id: string) => `/users/${id}/work-schedule`,
  UPDATE_WORK_SCHEDULE: (id: string) => `/users/${id}/work-schedule`,
  CLEAR_WORK_SCHEDULE: (id: string) => `/users/${id}/work-schedule`,

  // ===== CATEGORY =====
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // ===== BLOG =====
  BLOGS: "/blogs",
  BLOG_BY_ID: (id: string) => `/blogs/${id}`,

  // ===== SERVICE =====
  SERVICES: "/services",
  SERVICE_BY_ID: (id: string) => `/services/${id}`,
  SERVICES_BY_CATEGORY: (categoryId: string) => `/services/category/${categoryId}`,

  // ===== AR/VR Regimen =====
  ARVR_REGIMENS: "/arvrregimens", // GET all, POST create
  ARVR_REGIMEN_BY_ID: (id: string) => `/arvrregimens/${id}`, // GET one, PUT update, DELETE remove
  CREATE_ARVR_REGIMEN: "/arvrregimens", // POST
  UPDATE_ARVR_REGIMEN: (id: string) => `/arvrregimens/${id}`, // PUT
  DELETE_ARVR_REGIMEN: (id: string) => `/arvrregimens/${id}`, // DELETE

  // ===== BOOKING =====
  BOOKINGS: "/bookings",
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  BOOKINGS_BY_DOCTOR_NAME: (doctorName: string) => `/bookings/doctor/${doctorName}`,
  BOOKINGS_BY_USER_ID: (userId: string) => `/bookings/user/${userId}`,

  // ===== RESULT =====
  RESULTS: "/results",
  RESULT_BY_ID: (id: string) => `/results/${id}`,
  CREATE_RESULT: "/results",
  EDIT_RESULT: (id: string) => `/results/${id}`,
  RESULTS_BY_USER_ID: (userId: string) => `/results/user/${userId}`,
  RESULTS_BY_DOCTOR_NAME: (doctorName: string) => `/results/doctor/${doctorName}`,

  // ===== NOTIFICATION =====
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
  NOTIFICATIONS_BY_USER_ID: (userId: string) => `/notifications/user/${userId}`,

  // ===== REVIEW =====
  REVIEWS: "/reviews",
  REVIEW_BY_ID: (id: string) => `/reviews/${id}`,

  // ===== PAYMENT =====
  CREATE_PAYMENT_LINK: "/create-payment-link",
  GET_PAYMENT_BY_ORDER_CODE: (orderId: string | number) => `/order/${orderId}`,
  UPDATE_PAYMENT_STATUS: (orderCode: string | number) => `/order/${orderCode}`,
  GET_ALL_PAYMENTS: "/all",

  // ===== WEBHOOK =====
  WEBHOOK_RECEIVE: "/receive-hook",
  WEBHOOK_RECEIVE_GET: "/receive-hook-get",
};