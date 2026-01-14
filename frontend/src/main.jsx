import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './router/index.jsx'
import { RouterProvider } from 'react-router-dom';
import "smart-webcomponents-react/source/styles/smart.default.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/main.scss"
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
