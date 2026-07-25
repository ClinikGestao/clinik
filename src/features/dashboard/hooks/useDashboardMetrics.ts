import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      // Busca o total de equipamentos
      const { count: equipmentCount, error: eqError } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true });

      // Busca todas as ordens de serviço para calcularmos os status
      const { data: workOrders, error: woError } = await supabase
        .from('work_orders')
        .select('status, created_at');

      if (eqError) throw new Error(eqError.message);
      if (woError) throw new Error(woError.message);

      const openOrders = workOrders.filter(wo => wo.status === 'open').length;
      const inProgressOrders = workOrders.filter(wo => wo.status === 'in_progress').length;
      const completedOrders = workOrders.filter(wo => wo.status === 'completed').length;

      // Organiza os dados para o gráfico (Ex: quantidade por status)
      const chartData = [
        { name: 'Abertas', total: openOrders, fill: '#3b82f6' }, // blue-500
        { name: 'Em Andamento', total: inProgressOrders, fill: '#f59e0b' }, // amber-500
        { name: 'Concluídas', total: completedOrders, fill: '#10b981' }, // green-500
      ];

      return {
        totalEquipment: equipmentCount || 0,
        totalWorkOrders: workOrders.length,
        openOrders,
        inProgressOrders,
        completedOrders,
        chartData
      };
    }
  });
}