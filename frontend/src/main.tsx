import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Products from './pages/Products.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

const router=createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      {path:"/",element:<Home />},
      {path:"login",element:<Login/>},
      {path:"register",element:<Register />},
      {path:"products",element:(
      <ProtectedRoute>
        <Products />
        </ProtectedRoute>
      )
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
