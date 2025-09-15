// Service Worker Registration for PWA functionality

export interface ServiceWorkerRegistration {
  register(): Promise<void>;
  unregister(): Promise<boolean>;
}

export const ServiceWorkerRegistration = {
  async register(): Promise<void> {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
      } catch (registrationError) {
        console.log('SW registration failed: ', registrationError);
      }
    }
  },

  async unregister(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      return registration.unregister();
    }
    return false;
  }
};

// Legacy export for compatibility
export const register = ServiceWorkerRegistration.register;
export const unregister = ServiceWorkerRegistration.unregister;