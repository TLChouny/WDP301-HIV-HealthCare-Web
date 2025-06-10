// export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
export const BASE_URL = `http://localhost:5000/api`;


export const API_ENDPOINTS = {
  SIGNUP: "/users",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  VERIFYOTP: "/users/verify-otp",
  RESENDOTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  USER_BY_ID: (id: string) => `/users/${id}`,
  GET_ALL_USERS: "/users",
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,

  CATEGORIES: "/categories",
  SERVICES: "/services",
  SERVICE_BY_ID: (_id: any) => `/services/${_id}`,
  SERVICES_BY_CATEGORY: (categoryId: any) => `/services/category/${categoryId}`,
};
