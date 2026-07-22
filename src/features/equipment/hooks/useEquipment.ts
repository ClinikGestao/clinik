import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import type { EquipmentFormInputs } from '../schemas/equipmentSchemas';
import { useAuthStore } from '@/store/authStore';

export function useEquipments() {
  return useQuery({
    queryKey: ['equipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.tenantId);

  return useMutation({
    mutationFn: async (newEquipment: EquipmentFormInputs) => {
      const { data, error } = await supabase
        .from('equipment')
        .insert([
          {
            ...newEquipment,
            tenant_id: tenantId!, // Injetamos o ID da Clínica aqui!
          }
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });
}