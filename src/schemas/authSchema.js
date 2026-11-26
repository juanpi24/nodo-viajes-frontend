import { z } from 'zod';

// Esquema de validación para el registro de usuarios
export const registerSchema = z.object({
  nombre: z.string().min(2, 'Mí­nimo 2 caracteres').max(80),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mí­nimo 6 caracteres'),
});

// Esquema de validación para el login de usuarios
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
});


// 1. Esquema para el Admin (Crear usuario - Contraseña obligatoria)
export const createUserSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  rol: z.enum(['admin', 'cliente'])
});

// 2. Esquema para el Admin (Editar usuario - Contraseña opcional)
export const updateUserSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  email: z.string().email('Email inválido'),
  password: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: 'Si vas a cambiar la contraseña, debe tener al menos 6 caracteres',
  }),
  rol: z.enum(['admin', 'cliente'])
});
