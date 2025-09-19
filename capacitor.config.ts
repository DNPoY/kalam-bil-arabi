import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee7c66bbb34b4d68b7814288b6d07871',
  appName: 'kalam-bil-arabi',
  webDir: 'dist',
  server: {
    url: "https://ee7c66bb-b34b-4d68-b781-4288b6d07871.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    },
    App: {
      appUrlScheme: "app.lovable.ee7c66bbb34b4d68b7814288b6d07871"
    }
  }
};

export default config;