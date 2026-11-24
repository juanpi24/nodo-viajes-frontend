import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx'; 
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider> 
          <App />
          <ToastContainer position="bottom-right" theme="dark" />
        </FavoritesProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
