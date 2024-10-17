const backendSubdomain = import.meta.env.VITE_BACKEND_SUBDOMAIN_ENV || "augustin";
export const API_BASE_URL = `https://${backendSubdomain}.aomail.ai/aomail/`;
export const POP_UP_ERROR_COLOR = "bg-red-200/[.89] border border-red-400";
export const POP_UP_SUCCESS_COLOR = "bg-green-200/[.89] border border-green-400";
