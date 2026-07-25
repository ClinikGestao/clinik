import { z } from 'zod';

export const workOrderSchema = z.object({
  title: z.string().min(5, 'O título deve ter no mínimo 5 caracteres.'),
  description: z.string().optional(),
  equipment_id: z.string().uuid('Selecione um equipamento válido.'),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']), // <- Sem o default
  priority: z.enum(['low', 'medium', 'high', 'urgent']), // <- Sem o default
});

export type WorkOrderFormInputs = z.infer<typeof workOrderSchema>;