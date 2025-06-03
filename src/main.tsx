import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {backButton, closingBehavior, init, swipeBehavior, themeParams} from "@telegram-apps/sdk-react";

init();
themeParams.mountSync();
themeParams.bindCssVars();

swipeBehavior.mount();
swipeBehavior.disableVertical();

if (closingBehavior.mount.isAvailable()) {
  console.log('mount');
  closingBehavior.mount();
}

if (closingBehavior.enableConfirmation.isAvailable()) {
  // closingBehavior.enableConfirmation();
}

if (backButton.mount.isAvailable()) {
  backButton.mount();
}

createRoot(document.getElementById('root')!).render(
  <App />
)
