import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import {createBrowserRouter,RouterProvider,Navigate} from "react-router-dom";
import RootLayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import SignIn from './components/common/SignIn.jsx';
import SignUp from './components/common/SignUp.jsx';
import BuyerProfile from './components/buyer/BuyerProfile.jsx';
import VendorProfile from './components/vendor/VendorProfile.jsx';
import AddProduct from './components/vendor/AddProduct.jsx';
import Orders from './components/vendor/Orders.jsx';
import Products from './components/common/Products.jsx';
import Cart from './components/buyer/Cart.jsx';
import ProductById from './components/common/ProductById.jsx';
import BuyerVendorContext from './context/BuyerVendorContext.jsx'; 



const browserRouterObj=createBrowserRouter([  
  {
    path:"/",
    element:<RootLayout />,
    children:[
      {
        path:"",
        element:<Home />
      },
      {
        path:"signin",
        element:<SignIn />
      },
      { 
        path:"signup",
        element:<SignUp />
      },
      {
        path:"buyer-profile/:email",
        element:<BuyerProfile />,
        children:[
          {
            path:"products",
            element:<Products />
          },
          {path:":productId",
           element:<ProductById />
          },
          {path:"cart",
           element:<Cart />
          },
          {path:"",
            element:<Navigate to="products"/>
          }
        ]
      },
      {
        path:"vendor-profile/:email",
        element:<VendorProfile />,
        children:[
          {
            path:"products",
            element:<Products />
          },
          {
            path:"my-products",
            element:<Products />
          },
          {
            path:":productId",
           element:<ProductById />
          },
          {
            path:"add-product",
            element:<AddProduct />
          },
          {
            path:"orders",
            element:<Orders />
          },
          {
            path:"",
            element:<Navigate to="products"/>
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BuyerVendorContext>
    <RouterProvider router={browserRouterObj} />
    </BuyerVendorContext>
  </StrictMode>,
)
