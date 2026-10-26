import { useLocation, useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

interface Product{
  _id:string;
  name:string;
  description:string;
  price:number;
  images:string[];
  category:string;
  stock:number;
  certifications:string[];
  ownerId:string;
}

const Orders = () => {
  const location=useLocation();
  const navigate=useNavigate();

  const {productId,quantity}=location.state || {};

  const {isAuthenticated}=useAuth();

  const [product,setProduct]=useState<Product|null>(null);
  const [loading,setLoading]=useState<boolean>(true);
  const [error,setError]=useState<string>("");

  useEffect(()=>{
    const fetchProduct=async()=>{
      try{
        const res=await fetch(`http://localhost:5000/api/products/${productId}`);
        const data=await res.json();
        if(!res.ok){
          console.error(data.error);
        }

        setProduct(data.product);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    }

    if(!productId||!quantity||quantity<1){
      setError("Product or quantity information is missing.. Please select a product again");
      setLoading(false);
      return;
    }

    fetchProduct();
  },[productId,quantity])

  return (
    <>
    <title>AgroChain | Orders</title>
    <Navbar />
    <main className="min-h-screen bg-green-50">
        <h1 className="pt-20 text-center text-4xl font-bold">Order Summary</h1>
        {loading && (
          <p>Loading Product Details...</p>
        )}

        {error &&(
          <p>{error}</p>
        )}

        {!loading && !error && product && (
          <div className="grid lg:grid-cols-2">
            {product.images[0] ? (
              <div className="p-8 mt-4">
                <img src={product.images[0]} alt={product.name} className="w-200 h-150 rounded-lg" />
              </div>
            ):(
              <div>
                <p>No Image available...</p>
              </div>
            )}
            <div className="p-12 bg-white m-12 border rounded-lg">
              <h1 className="text-center text-3xl font-semibold">Order Details</h1>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Product Name:{" "}</span>{product.name}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Product Category:{" "}</span>{product.category}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Price of a single unit:{" "}</span>₹ {product.price}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Quantity:{" "}</span>{quantity}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Total Price:{" "}</span>₹ {product.price*quantity}</p>
              <button onClick={()=>navigate("/checkout",{state:{productId,quantity}})} className="mt-4 bg-blue-950 p-2 text-white w-full font-bold hover:bg-blue-800 cursor-pointer">Proceed to Checkout</button>
            </div>
          </div>
        )}
        {isAuthenticated ? (
          <Navbar showLogin={false} showSignup={false}/>
        ):(
          <Navbar />
        )}
    </main>
    <Footer />
    </>
  )
}

export default Orders