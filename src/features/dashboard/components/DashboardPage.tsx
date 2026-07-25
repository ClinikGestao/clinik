import { Activity, Wrench, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

export function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center animate-pulse text-slate-500">Carregando painel...</div>;
  }

  const statCards = [
    { title: 'Total de Equipamentos', value: metrics?.totalEquipment || 0, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'O.S. Abertas', value: metrics?.openOrders || 0, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Em Manutenção', value: metrics?.inProgressOrders || 0, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Concluídas', value: metrics?.completedOrders || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">Ordens de Serviço por Status</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.chartData || []}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {metrics?.chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}