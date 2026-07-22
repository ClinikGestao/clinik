import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export const onboardingSchema = z.object({
  clinicName: z.string().min(3, 'O nome da clínica precisa ter no mínimo 3 caracteres.'),
  // O slug será a URL. Só aceita letras minúsculas, números e hifens.
  slug: z.string()
    .min(3, 'O subdomínio precisa ter no mínimo 3 caracteres.')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hifens (sem espaços).'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
export type OnboardingFormInputs = z.infer<typeof onboardingSchema>;