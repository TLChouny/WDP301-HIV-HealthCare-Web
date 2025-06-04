export const BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  SIGNUP: "/users",
  LOGIN: "/users/login",
  VERIFYOTP: "/users/verify-otp",
  RESENDOTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  CATEGORIES: "/categories",
  SERVICES: "/services",
  SERVICE_BY_ID: (_id: any) => `/services/${_id}`,
  SERVICES_BY_CATEGORY: (categoryId: any) => `/services/category/${categoryId}`,
};
