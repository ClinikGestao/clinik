import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import type { WorkOrderFormInputs } from '../schemas/workOrderSchemas';
import { useAuthStore } from '@/store/authStore';

export function useWorkOrders() {
  return useQuery({
    queryKey: ['work-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          equipment (
            name,
            serial_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.tenantId);

  return useMutation({
    mutationFn: async (newOrder: WorkOrderFormInputs) => {
      const { data, error } = await supabase
        .from('work_orders')
        .insert([
          {
            ...newOrder,
            tenant_id: tenantId!,
          }
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
    },
  });
}