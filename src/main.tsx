import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {backButton, closingBehavior, init} from "@telegram-apps/sdk-react";
import {BrowserRouter} from "react-router";

init();

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
  <BrowserRouter>
    <App />
  </BrowserRouter> as React.ReactNode
)
