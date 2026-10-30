import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Products from './pages/Products.tsx'
import ProductDetails from './pages/ProductDetails.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Orders from './pages/Orders.tsx'
import Checkout from './pages/Checkout.tsx'
import MyOrders from './pages/MyOrders.tsx'
import ReceivedOrders from './pages/ReceivedOrders.tsx'

const router=createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      {path:"/",element:<Home />},
      {path:"login",element:<Login/>},
      {path:"register",element:<Register/>},
      {path:"products",element:<Products/>},
      {path:"products/:id",element:<ProductDetails/>},
      {path:"/orders",element:(
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      )},
      {path:"/checkout",element:(
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      )},
      {path:"/my-orders",element:(
        <ProtectedRoute>
          <MyOrders/>
        </ProtectedRoute>
      )},

      {path:"/received-orders",element:(
        <ProtectedRoute allowedRoles={["farmer","supplier"]}>
          <ReceivedOrders />
        </ProtectedRoute>
      )}
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
