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
import MyProducts from './pages/MyProducts.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import AdminUsers from './pages/AdminUsers.tsx'
import AdminProducts from './pages/AdminProducts.tsx'
import AdminOrders from './pages/AdminOrders.tsx'
import AdminCertifications from './pages/AdminCertifications.tsx'

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
        <ProtectedRoute allowedRoles={["buyer"]}>
          <Orders />
        </ProtectedRoute>
      )},
      {path:"/checkout",element:(
        <ProtectedRoute allowedRoles={["buyer"]}>
          <Checkout />
        </ProtectedRoute>
      )},
      {path:"/my-orders",element:(
        <ProtectedRoute allowedRoles={["buyer"]}>
          <MyOrders/>
        </ProtectedRoute>
      )},

      {path:"/received-orders",element:(
        <ProtectedRoute allowedRoles={["farmer","supplier"]}>
          <ReceivedOrders />
        </ProtectedRoute>
      )},

      {path:"/my-products",element:(
        <ProtectedRoute allowedRoles={["farmer","supplier"]}>
          <MyProducts />
        </ProtectedRoute>
      )},
      {path:"/admin-dashboard",element:(
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      )},
      {path:"/admin-user",element:(
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers/>
        </ProtectedRoute>
      )},
      {path:"/admin-product",element:(
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminProducts />
        </ProtectedRoute>
      )},
      {path:"/admin-orders",element:(
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminOrders />
        </ProtectedRoute>
      )},

      {path:"/admin-certifications",element:(
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminCertifications />
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
