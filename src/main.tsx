import {createRoot} from 'react-dom/client'
import './index.css';
import './iconmoon.css';
import App from './App.tsx'
import {backButton, closingBehavior, init, swipeBehavior, themeParams} from "@telegram-apps/sdk-react";
import {TonConnectUIProvider} from '@tonconnect/ui-react';

init();
themeParams.mountSync();
themeParams.bindCssVars();

swipeBehavior.mount();
swipeBehavior.disableVertical();

// settingsButton.mount();
// settingsButton.show();

if (closingBehavior.mount.isAvailable()) {
  closingBehavior.mount();
}

if (closingBehavior.enableConfirmation.isAvailable()) {
  // closingBehavior.enableConfirmation();
}

if (backButton.mount.isAvailable()) {
  backButton.mount();
}

createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl="http://localhost:5173/tonconnect-manifest.json">
    <App />
  </TonConnectUIProvider>
)
