export function getTenantSlugFromHost(): string | null {
  const hostname = window.location.hostname;

  // 1. Tratamento para ambiente de Desenvolvimento (Localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null; // Retorna nulo para carregar a Landing Page principal
    
    // DICA: Para testar um tenant localmente depois, você acessará algo como:
    // http://clinica-a.localhost:5173
  }

  // 2. Tratamento para Produção
  const mainDomain = 'clinik.com'; // O seu domínio principal oficial
  
  // Se for o domínio principal, carrega a Landing Page
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    return null; 
  }

  // Se for um subdomínio (ex: clinica-a.clinik.com)
  if (hostname.endsWith(`.${mainDomain}`)) {
    // Remove o '.clinik.com' e retorna apenas 'clinica-a'
    return hostname.replace(`.${mainDomain}`, '');
  }

  // Se o cliente usar um domínio próprio (ex: app.clinicasaolucas.com.br)
  return hostname; 
}