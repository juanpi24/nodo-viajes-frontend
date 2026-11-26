import { z } from 'zod';
import { CATEGORIAS } from '../constants/destinos.js';

// Reglas de validación del formulario, en un solo lugar.
export const packageSchema = z.object({
  titulo: z
  .string()
  .min(3, 'El título debe tener al menos 3 caracteres')
  .max(80, 'El título no puede superar los 80 caracteres'),
  destino: z
  .string()
  .min(2, 'El destino debe tener al menos 2 caracteres')
  .max(80, 'El destino no puede superar los 80 caracteres'),
  descripcion: z
  .string()
  .min(10, 'La descripción debe tener al menos 10 caracteres')
  .max(500, 'La descripción no puede superar los 500 caracteres'),
  precio: z.coerce.number().int().positive('El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  imagen: z.string().url('Ingresá una URL válida (empieza con https://)'),
  categoria: z.enum(
    CATEGORIAS,
    { error: 'Elegí una categoría de la lista' },
  ),
  destacado: z.boolean().default(false),
  coordenadas: z
    .object({
      lat: z.coerce.number().optional(),
      lng: z.coerce.number().optional(),
    })
    .optional(),
});
