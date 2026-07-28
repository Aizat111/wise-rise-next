/**
 * Utility functions for connector script management
 * Ensures connector script is loaded before creating instances
 */

/**
 * Waits for the connector script to be available on window object
 * @param maxWait Maximum time to wait in milliseconds (default: 5000ms)
 * @returns Promise that resolves when connector is available
 * @throws Error if connector fails to load within maxWait time
 */
export const waitForConnector = (maxWait = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already available, resolve immediately
    if (
      typeof window !== 'undefined' &&
      (window as any).connector &&
      typeof (window as any).connector.create === 'function'
    ) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkConnector = () => {
      if (
        typeof window !== 'undefined' &&
        (window as any).connector &&
        typeof (window as any).connector.create === 'function'
      ) {
        resolve();
      } else if (Date.now() - startTime > maxWait) {
        reject(new Error('Connector script failed to load within timeout'));
      } else {
        setTimeout(checkConnector, 100);
      }
    };
    checkConnector();
  });
};

/**
 * Checks if connector is currently available
 * @returns boolean indicating if connector is ready
 */
export const isConnectorReady = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    (window as any).connector !== undefined &&
    typeof (window as any).connector.create === 'function'
  );
};
