import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  description: z.string().optional(),
  serial_number: z.string().min(1, 'O número de série é obrigatório.'),
  category: z.string().min(2, 'A categoria é obrigatória.'), // <- Adicionado!
  status: z.enum(['active', 'maintenance', 'inactive']), // <- Sem o .default()
  specifications: z.any().optional(), 
});

export type EquipmentFormInputs = z.infer<typeof equipmentSchema>;