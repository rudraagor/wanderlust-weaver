import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply dark mode from localStorage before render to prevent flash
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
  document.documentElement.classList.add('dark');
} else if (savedDarkMode === 'false') {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
