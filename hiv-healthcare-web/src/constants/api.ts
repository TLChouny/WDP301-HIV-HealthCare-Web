export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

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
