import { z } from 'zod';
import { 
  insertRegistrationSchema, registrations, 
  insertUserSchema, loginSchema, users, 
  insertBlogPostSchema, blogPosts, 
  insertBlogCommentSchema, blogComments,
  insertBlogTagSchema, blogTags,
  blogImages,
  insertNewsletterSchema, newsletterSubscriptions 
} from './schema';

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
      path: '/api/registrations' as const,
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
      path: '/api/auth/register' as const,
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
      path: '/api/auth/login' as const,
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
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
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
  blog: {
    list: {
      method: 'GET' as const,
      path: '/api/blog' as const,
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/blog/:slug' as const,
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        404: errorSchemas.internal,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/blog' as const,
      input: insertBlogPostSchema,
      responses: {
        201: z.custom<typeof blogPosts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/blog/:id' as const,
      input: insertBlogPostSchema.partial(),
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/blog/:id' as const,
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.internal,
      },
    },
    byCategory: {
      method: 'GET' as const,
      path: '/api/blog/category/:category' as const,
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    search: {
      method: 'GET' as const,
      path: '/api/blog/search/:query' as const,
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    comments: {
      list: {
        method: 'GET' as const,
        path: '/api/blog/:slug/comments' as const,
        responses: {
          200: z.array(z.custom<typeof blogComments.$inferSelect>()),
          404: errorSchemas.internal,
        },
      },
      create: {
        method: 'POST' as const,
        path: '/api/blog/:slug/comments' as const,
        input: insertBlogCommentSchema,
        responses: {
          201: z.custom<typeof blogComments.$inferSelect>(),
          400: errorSchemas.validation,
          404: errorSchemas.internal,
        },
      },
      delete: {
        method: 'DELETE' as const,
        path: '/api/blog/comments/:id' as const,
        responses: {
          200: z.object({ message: z.string() }),
          404: errorSchemas.internal,
        },
      },
    },
    tags: {
      list: {
        method: 'GET' as const,
        path: '/api/blog/tags' as const,
        responses: {
          200: z.array(z.custom<typeof blogTags.$inferSelect>()),
        },
      },
      create: {
        method: 'POST' as const,
        path: '/api/blog/tags' as const,
        input: insertBlogTagSchema,
        responses: {
          201: z.custom<typeof blogTags.$inferSelect>(),
          400: errorSchemas.validation,
        },
      },
      setForPost: {
        method: 'POST' as const,
        path: '/api/blog/:postId/tags' as const,
        input: z.object({ tagIds: z.array(z.number()) }),
        responses: {
          200: z.object({ message: z.string() }),
          400: errorSchemas.validation,
        },
      },
    },
    images: {
      list: {
        method: 'GET' as const,
        path: '/api/blog/:postId/images' as const,
        responses: {
          200: z.array(z.custom<typeof blogImages.$inferSelect>()),
        },
      },
      create: {
        method: 'POST' as const,
        path: '/api/blog/images' as const,
        input: z.object({
          postId: z.number().optional(),
          url: z.string().url(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        }),
        responses: {
          201: z.custom<typeof blogImages.$inferSelect>(),
          400: errorSchemas.validation,
        },
      },
      delete: {
        method: 'DELETE' as const,
        path: '/api/blog/images/:id' as const,
        responses: {
          200: z.object({ message: z.string() }),
          404: errorSchemas.internal,
        },
      },
    },
  },
  newsletter: {
    subscribe: {
      method: 'POST' as const,
      path: '/api/newsletter/subscribe' as const,
      input: insertNewsletterSchema,
      responses: {
        201: z.object({ message: z.string() }),
        400: errorSchemas.validation,
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
