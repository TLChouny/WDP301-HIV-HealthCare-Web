// api.ts

// export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
export const BASE_URL = `http://localhost:5000/api`;

export const API_ENDPOINTS = {
  // User Authentication
  SIGNUP: "/users",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  VERIFY_OTP: "/users/verify-otp",
  RESEND_OTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  VERIFY_RESET_OTP: "/users/verify-reset-otp",
  RESET_PASSWORD: "/users/reset-password",

  // User CRUD
  GET_ALL_USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,

  // Category
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // Blog
  BLOGS: "/blogs",
  BLOG_BY_ID: (id: string) => `/blogs/${id}`,

  // Service
  SERVICES: "/services",
  SERVICE_DETAIL: (id: string) => `/services/detail/${id}`,
  SERVICE_BY_ID: (id: string) => `/services/${id}`,
  SERVICES_BY_CATEGORY: (categoryId: string) => `/services/category/${categoryId}`,

  // AR/VR Regimen
  ARVR_REGIMENS: "/arvrregimens",
  ARVR_REGIMEN_BY_ID: (id: string) => `/arvrregimens/${id}`,

  // Booking
  BOOKINGS: "/bookings",
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  BOOKINGS_BY_DOCTOR_NAME: (doctorName: string) => `/bookings/doctor/${doctorName}`,

  // Result
  RESULTS: "/results",
  RESULT_BY_ID: (id: string) => `/results/${id}`,

  // Notification
  NOTIFICATIONS: "/notifications", // Lấy tất cả hoặc tạo mới (POST)
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`, // Lấy, cập nhật, xóa theo ID
  NOTIFICATIONS_BY_USER_ID: (userId: string) => `/notifications/user/${userId}`, // Lấy theo User ID
  // Review
  REVIEWS: "/reviews",
  REVIEW_BY_ID: (id: string) => `/reviews/${id}`,
};