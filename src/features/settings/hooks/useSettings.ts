import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/store/authStore';
import type { SettingsFormInputs } from '../schemas/settingsSchema';

// Busca os dados da clínica (Tenant)
export function useTenantSettings() {
  const tenantId = useAuthStore((state) => state.tenantId);

  return useQuery({
    queryKey: ['tenant-settings', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('Tenant ID não encontrado');

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!tenantId, // Só roda a query se tiver o ID
  });
}

// Atualiza os dados da clínica
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.tenantId);

  return useMutation({
    mutationFn: async (formData: SettingsFormInputs) => {
      if (!tenantId) throw new Error('Tenant ID não encontrado');

      // Montamos o payload estruturando a cor dentro do JSON theme_colors
      const payload = {
        name: formData.name,
        theme_colors: { primary: formData.primaryColor },
      };

      const { data, error } = await supabase
        .from('tenants')
        .update(payload)
        .eq('id', tenantId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });
    },
  });
}