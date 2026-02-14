import { z } from 'zod';
import { 
  insertRegistrationSchema, registrations, 
  insertUserSchema, loginSchema, users 
} from './schema';

// Base URL for API requests
// In production on Vercel, use VITE_API_URL environment variable
// In development, use relative paths (same origin via Vite proxy)
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Check for Vite environment variable (set at build time)
  const viteApiUrl = (import.meta as any).env?.VITE_API_URL;
  if (viteApiUrl && viteApiUrl !== '%%API_URL%%') {
    return viteApiUrl;
  }
  
  // Check for window.ENV (for runtime injection)
  const windowEnv = (window as any).ENV?.API_URL;
  if (windowEnv && windowEnv !== '%%API_URL%%') {
    return windowEnv;
  }
  
  // Fallback: detect production and use known backend URL
  if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    // Production frontend - use the Render backend
    return 'https://darave-studios-api.onrender.com';
  }
  
  // Development - use relative paths (Vite proxy)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  registrations: {
    create: {
      method: 'POST' as const,
      path: `${API_BASE_URL}/api/registrations` as const,
      input: insertRegistrationSchema,
      responses: {
        201: z.custom<typeof registrations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  auth: {
    register: {
      method: 'POST' as const,
      path: `${API_BASE_URL}/api/auth/register` as const,
      input: insertUserSchema,
      responses: {
        201: z.object({
          user: z.object({
            id: z.number(),
            email: z.string(),
            name: z.string(),
          }),
        }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: `${API_BASE_URL}/api/auth/login` as const,
      input: loginSchema,
      responses: {
        200: z.object({
          user: z.object({
            id: z.number(),
            email: z.string(),
            name: z.string(),
          }),
        }),
        401: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: `${API_BASE_URL}/api/auth/logout` as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: `${API_BASE_URL}/api/auth/me` as const,
      responses: {
        200: z.object({
          user: z.object({
            id: z.number(),
            email: z.string(),
            name: z.string(),
          }),
        }),
        401: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
