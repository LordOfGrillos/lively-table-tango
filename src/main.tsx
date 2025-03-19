
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Starting application...");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log("Root created, rendering App");
    root.render(<App />);
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error("Fatal error during app initialization:", error);
  // Display a minimal error message in case the app can't render
  document.body.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h2>Application Error</h2>
      <p>Sorry, the application couldn't load properly. Please check the console for more details.</p>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
