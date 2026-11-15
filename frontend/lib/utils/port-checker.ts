/**
 * Port Checker Utility
 * Verifies if a port is available before starting services
 */

export async function checkPort(port: number, host = 'localhost'): Promise<boolean> {
  const net = await import('net');
  
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port, host);
  });
}

export async function findAvailablePort(startPort: number, maxAttempts = 10): Promise<number> {
  let port = startPort;
  
  for (let i = 0; i < maxAttempts; i++) {
    const available = await checkPort(port);
    if (available) {
      return port;
    }
    port++;
  }
  
  throw new Error(`No available port found starting from ${startPort}`);
}

export interface PortStatus {
  port: number;
  available: boolean;
  message: string;
}

export async function getPortStatus(port: number, serviceName: string): Promise<PortStatus> {
  const available = await checkPort(port);
  
  return {
    port,
    available,
    message: available 
      ? `${serviceName} can run on port ${port}`
      : `Port ${port} is in use - cannot start ${serviceName}`
  };
}

/**
 * Main verification function to be called before generating project links
 */
export async function verifyServicesBeforeDeployment(
  frontendPort: number,
  backendPort: number
): Promise<{
  frontend: PortStatus;
  backend: PortStatus;
  allAvailable: boolean;
  warnings: string[];
}> {
  const frontend = await getPortStatus(frontendPort, 'Frontend (MailChat)');
  const backend = await getPortStatus(backendPort, 'Backend (API)');
  
  const warnings: string[] = [];
  
  if (!frontend.available) {
    warnings.push(`Porta ${frontendPort} em uso. Feche a aplicação atual ou mude a porta.`);
  }
  
  if (!backend.available) {
    warnings.push(`Porta ${backendPort} em uso. Feche o serviço backend ou mude a porta.`);
  }
  
  return {
    frontend,
    backend,
    allAvailable: frontend.available && backend.available,
    warnings
  };
}
