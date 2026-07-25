import { z } from 'zod';

export const settingsSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida. Use o formato HEX (ex: #4f46e5).'),
});

export type SettingsFormInputs = z.infer<typeof settingsSchema>;