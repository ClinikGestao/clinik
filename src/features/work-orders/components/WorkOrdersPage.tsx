import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, PlusCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { workOrderSchema } from '../schemas/workOrderSchemas';
import type { WorkOrderFormInputs } from '../schemas/workOrderSchemas';
import { useWorkOrders, useCreateWorkOrder } from '../hooks/useWorkOrders';
import { useEquipments } from '@/features/equipment/hooks/useEquipment';

export function WorkOrdersPage() {
  const { data: workOrders, isLoading } = useWorkOrders();
  const { data: equipments } = useEquipments();
  const createMutation = useCreateWorkOrder();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkOrderFormInputs>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      status: 'open',
      priority: 'medium',
    }
  });

  const onSubmit = (data: WorkOrderFormInputs) => {
    createMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  const statusConfig = {
    open: { label: 'Aberta', icon: AlertCircle, color: 'text-blue-600 bg-blue-100' },
    in_progress: { label: 'Em Andamento', icon: Clock, color: 'text-amber-600 bg-amber-100' },
    completed: { label: 'Concluída', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    cancelled: { label: 'Cancelada', icon: PlusCircle, color: 'text-slate-600 bg-slate-100' },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Ordens de Serviço</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Formulário de Abertura */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Wrench size={20} className="text-indigo-600" />
              Abrir Chamado
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700">Título do Problema</label>
              <input {...register('title')} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm" placeholder="Ex: Tela piscando" />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Equipamento</label>
              <select {...register('equipment_id')} className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm">
                <option value="">Selecione um equipamento...</option>
                {equipments?.map((eq) => (
                  <option key={eq.id} value={eq.id}>{eq.name} (SN: {eq.serial_number})</option>
                ))}
              </select>
              {errors.equipment_id && <p className="mt-1 text-xs text-red-500">{errors.equipment_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Prioridade</label>
              <select {...register('priority')} className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={createMutation.isPending}
              className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Salvando...' : 'Abrir Ordem de Serviço'}
            </button>
          </form>
        </div>

        {/* Lista de Chamados */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-800">Chamados Recentes</h3>
            </div>
            
            <div className="p-4">
              {isLoading ? (
                <p className="animate-pulse py-8 text-center text-slate-500">Carregando ordens...</p>
              ) : workOrders?.length === 0 ? (
                <p className="py-8 text-center text-slate-500">Nenhum chamado aberto ainda.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {workOrders?.map((order) => {
                    const status = order.status as keyof typeof statusConfig;
                    const config = statusConfig[status] || statusConfig.open;
                    const StatusIcon = config.icon;
                    
                    const equipmentName = Array.isArray(order.equipment) ? order.equipment[0]?.name : order.equipment?.name;

                    return (
                      <li key={order.id} className="flex items-center justify-between rounded-md px-2 py-4 transition-colors hover:bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-800">{order.title}</p>
                          <p className="font-mono text-sm text-slate-500">
                            Equipamento: {equipmentName || 'Desconhecido'} | Prioridade: {order.priority.toUpperCase()}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
                          <StatusIcon size={14} />
                          {config.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}