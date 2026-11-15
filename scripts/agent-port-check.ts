/**
 * Port Verification Function for Agent Use
 * This function checks if ports are available before generating project links
 * Returns: JSON object with port status and recommended actions
 */

import { verifyServicesBeforeDeployment } from '../frontend/lib/utils/port-checker';

interface PortCheckResult {
  timestamp: string;
  frontend: {
    port: number;
    recommendedUrl: string;
    status: 'available' | 'in_use';
  };
  backend: {
    port: number;
    recommendedUrl: string;
    status: 'available' | 'in_use';
  };
  actions: {
    generateLinks: boolean;
    warnings: string[];
    recommendations: string[];
  };
}

/**
 * Main function to verify ports and generate safe project links
 * Call this BEFORE generating any project links to ensure ports are available
 * 
 * @param frontendPort - Expected frontend port (default: 3100)
 * @param backendPort - Expected backend port (default: 8788)
 * @returns PortCheckResult with status and recommendations
 */
export async function verifyAndGenerateLinks(
  frontendPort: number = 3100,
  backendPort: number = 8788
): Promise<PortCheckResult> {
  const result = await verifyServicesBeforeDeployment(frontendPort, backendPort);
  
  const timestamp = new Date().toISOString();
  
  return {
    timestamp,
    frontend: {
      port: result.frontend.available ? frontendPort : frontendPort,
      recommendedUrl: `http://localhost:${result.frontend.available ? frontendPort : 'unavailable'}`,
      status: result.frontend.available ? 'available' : 'in_use'
    },
    backend: {
      port: result.backend.available ? backendPort : backendPort,
      recommendedUrl: `http://localhost:${result.backend.available ? backendPort : 'unavailable'}/api`,
      status: result.backend.available ? 'available' : 'in_use'
    },
    actions: {
      generateLinks: result.allAvailable,
      warnings: result.warnings,
      recommendations: result.allAvailable
        ? [
            'Portas disponíveis - pronto para gerar links',
            `Frontend disponível em: http://localhost:${frontendPort}`,
            `Backend disponível em: http://localhost:${backendPort}/api`
          ]
        : [
            'Feche serviços em execução ou altere as portas',
            `Porta ${result.frontend.available ? 'em uso' : 'disponível'}: Frontend ${frontendPort}`,
            `Porta ${result.backend.available ? 'em uso' : 'disponível'}: Backend ${backendPort}`
          ]
    }
  };
}

// CLI usage
if (import.meta?.main || process.argv[1]?.endsWith(process.argv[1])) {
  const main = async () => {
    console.log('🔍 Verificando portas antes de gerar links de projeto...\n');
    
    const result = await verifyAndGenerateLinks(3100, 8788);
    
    console.log('========================================');
    console.log('RESULTADO DA VERIFICAÇÃO DE PORTAS');
    console.log('========================================');
    console.log(`Frontend: ${result.frontend.status === 'available' ? '✅' : '❌'} Porta ${result.frontend.port}`);
    console.log(`Backend:  ${result.backend.status === 'available' ? '✅' : '❌'} Porta ${result.backend.port}`);
    console.log('');
    
    if (result.actions.generateLinks) {
      console.log('✅ PORTAS DISPONÍVEIS - Links seguros para gerar:');
      console.log(`   Frontend: ${result.frontend.recommendedUrl}`);
      console.log(`   API:      ${result.backend.recommendedUrl}`);
    } else {
      console.log('⚠️  ATENÇÃO: Algumas portas em uso!');
      console.log('   Ações recomendadas:');
      result.actions.recommendations.forEach(r => console.log(`   - ${r}`));
    }
  };
  
  main().catch(console.error);
}

export default verifyAndGenerateLinks;
