import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Os dados ficam "frescos" por 5 minutos. 
      // Evita requisições repetidas se o Analista navegar entre páginas rápido.
      staleTime: 1000 * 60 * 5, 
      
      // Se a API falhar (ex: queda rápida de internet), tenta só mais 1 vez antes de dar erro
      retry: 1, 
      
      // Quando o usuário minimiza e volta para a aba do sistema, faz refetch em background.
      // Isso é CRÍTICO para o Kanban de Ordens de Serviço se manter atualizado sozinho.
      refetchOnWindowFocus: true, 
    },
  },
});