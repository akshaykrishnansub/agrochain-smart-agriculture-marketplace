import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.js";
import { useAuth } from "../context/AuthContext.js";
import { useEffect, useState } from "react";

interface Product{
  _id:string;
  name:string;
  price:number;
  images:string[];
}

const Home = () => {
    const navigate=useNavigate();
    const {isAuthenticated}=useAuth();
    const [products,setProducts]=useState<Product[]>([]);

    useEffect(()=>{
      const fetchProducts=async()=>{
        try{
          const res=await fetch(`http://localhost:5000/api/products`);
          const data=await res.json();
          if(!res.ok){
            throw new Error(data.message || "Unable to fetch Products");
          }

          setProducts(data.products.slice(0,4));
        }catch(err){
          console.error(err);
        }
      }
      fetchProducts();
    },[])
  return (
    <>
    <title>AgroChain - Smart Agriculture Market Place</title>
    <Navbar />
    <div className="p-8 bg-green-50 mt-16">
        <h1 className="text-4xl text-center font-bold text-green-950">Smart Agriculture Market Place</h1>
        <p className="text-center mt-2 font-semibold text-green-800">Connecting farmers, suppliers and buyers directly</p>
        <div className="text-center mt-10">
            <button onClick={()=>navigate("/products")} className="bg-green-500 hover:bg-green-600 cursor-pointer p-2 border border-green-950 text-white font-semibold">Explore Marketplace</button>
        </div>
    </div>
    <div className="p-8 bg-green-950">
      <h1 className="text-4xl text-center font-bold text-white">How AgroChain Works?</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-1 mt-4">
        <div className="border pt-2 pb-2 rounded bg-amber-400">
          <h1 className="text-center text-4xl">🌱</h1>
          <h2 className="text-center text-3xl font-bold">Farmer</h2>
          <p className="text-center text-xl font-normal">1. List products</p>
          <p className="text-center text-xl font-normal">2. Manage Stocks</p>
          <p className="text-center text-xl font-normal">3. Manage Orders</p>
        </div>
        <div className="border pt-2 pb-2 rounded bg-amber-400">
          <h1 className="text-center text-4xl">🚜</h1>
          <h2 className="text-center text-3xl font-bold">Supplier</h2>
          <p className="text-center text-xl font-normal">1. Manage Products</p>
          <p className="text-center text-xl font-normal">2. Manage Incoming Orders</p>
        </div>
        <div className="border pt-2 pb-2 rounded bg-amber-400">
          <h1 className="text-center text-4xl">🛒</h1>
          <h2 className="text-center text-3xl font-bold">Buyer</h2>
          <p className="text-center text-xl font-normal">1. Discover Products</p>
          <p className="text-center text-xl font-normal">2. Order Products</p>
        </div>
        <div className="border pt-2 pb-2 rounded bg-amber-400">
          <h1 className="text-center text-4xl">⚙️</h1>
          <h2 className="text-center text-3xl font-bold">Admin</h2>
          <p className="text-center text-xl font-normal">1. Manage Users</p>
          <p className="text-center text-xl font-normal">2. Manage Products</p>
          <p className="text-center text-xl font-normal">3. Manage Orders and Certifications</p>
        </div>
      </div>
    </div>
    <div className="p-8">
      <h1 className="text-center text-4xl font-bold">Marketplace Products</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-4 gap-2">
        {products.map((product)=>(
          <div key={product._id} className="p-4 rounded-lg shadow-lg">
            {product.images[0]?(
              <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
            ):(
              <div className="w-full h-40 flex items-center justify-center">
                No Image Available
              </div>
            )}
            <h2 className="font-bold mt-2">{product.name}</h2>
            <p className="text-green-800 font-semibold mt-2">₹ {product.price}</p>
          </div>
        ))}
      </div>
    </div>
    {isAuthenticated ? (
      <Navbar showLogin={false} showSignup={false} />
    ):(
      <Navbar />
    )}
    <Footer/>
    </>
  )
}

export default Home

