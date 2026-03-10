import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material';
import ThemeContextProvider from "./app/ThemeContext.jsx";
import { UserProvider } from "./app/UserContext";

import './index.css'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <UserProvider>
          <CssBaseline />
          <App />
        </UserProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>
)
