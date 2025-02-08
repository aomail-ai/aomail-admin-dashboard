const backendSubdomain = import.meta.env.VITE_BACKEND_SUBDOMAIN_ENV;
export const API_BASE_URL = backendSubdomain ? `https://${backendSubdomain}.aomail.ai/aomail/` : "http://localhost:8010/aomail/";
export const MICROSOFT = "microsoft";
export const GOOGLE = "google";
