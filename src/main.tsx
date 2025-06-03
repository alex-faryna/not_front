import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {backButton, closingBehavior, init, settingsButton, swipeBehavior, themeParams} from "@telegram-apps/sdk-react";

init();
themeParams.mountSync();
themeParams.bindCssVars();

swipeBehavior.mount();
swipeBehavior.disableVertical();

settingsButton.mount();
settingsButton.show();

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
