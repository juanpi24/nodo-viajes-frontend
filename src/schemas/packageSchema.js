import { z } from 'zod';
import { CATEGORIAS } from '../constants/destinos.js';

// Helper para inputs numéricos obligatorios (evita que "" pase como 0)
const requiredNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === null ? undefined : val), schema);

// Helper para inputs numéricos opcionales (convierte "" en undefined en vez de 0)
const optionalNumber = (schema) =>
  z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    schema.optional(),
  );

export const packageSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede superar los 80 caracteres'),
  destino: z
    .string()
    .trim()
    .min(2, 'El destino debe tener al menos 2 caracteres')
    .max(80, 'El destino no puede superar los 80 caracteres'),
  descripcion: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar los 500 caracteres'),
  precio: requiredNumber(
    z.coerce
      .number({ error: 'Ingresá un precio válido' })
      .int('El precio debe ser un número entero')
      .min(1, 'El precio debe ser mayor a 0'),
  ),
  stock: requiredNumber(
    z.coerce
      .number({ error: 'Ingresá el stock disponible' })
      .int('El stock debe ser un número entero')
      .min(0, 'El stock no puede ser negativo'),
  ),
  imagen: z
    .string()
    .trim()
    .url('Ingresá una URL válida (empieza con https://)'),
  categoria: z.enum(CATEGORIAS, {
    error: 'Elegí una categoría de la lista',
  }),
  destacado: z.boolean().default(false),
  coordenadas: z
    .object({
      lat: optionalNumber(
        z.coerce
          .number({ error: 'La latitud debe ser un número' })
          .min(-90, 'Mínimo -90')
          .max(90, 'Máximo 90'),
      ),
      lng: optionalNumber(
        z.coerce
          .number({ error: 'La longitud debe ser un número' })
          .min(-180, 'Mínimo -180')
          .max(180, 'Máximo 180'),
      ),
    })
    .optional(),
});
