import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";

interface Product{
    _id:string;
    name:string;
    description:string;
    price:number;
    category:string;
    images:string[];
    ownerId:{
        _id:string;
        name:string;
        email:string;
        role:"farmer"|"supplier";
    }
    certifications:string[];
    stock:number;
}

const AdminProducts = () => {
    const [products,setProducts]=useState<Product[]>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string>("");
    const {isAuthenticated}=useAuth();

    useEffect(()=>{
        const fetchProducts=async()=>{
            try{
                const res=await fetch(`http://localhost:5000/api/admin/products`,{
                    method:"GET",
                    credentials:"include"
                })

                const data=await res.json();
                if(!res.ok){
                    throw new Error(data.message||"Failed to load products");
                }

                setProducts(data.products);
            }catch(err){
                setError("Unable to load products");
            }finally{
                setLoading(false);
            }
        }
        fetchProducts();
    },[])

    const handleDeleteProduct=async(productId:string)=>{
        if(!window.confirm("Do you want to delete this product?")){
            return;
        }
        try{
            const res=await fetch(`http://localhost:5000/api/admin/products/${productId}`,{
                method:"DELETE",
                credentials:"include"
            })

            const data=await res.json();
            if(!res.ok){
                throw new Error(data.message||"Failed to delete product");
            }

            setProducts(products=>products.filter((product)=>product._id!==productId));
        }catch(err){
            setError("Unable to delete the product");
        }
    }
    
  return (
    <>
    <title>AgroChain | Admin Product Management</title>
    <Navbar />
    <main className="bg-green-50 pt-16 min-h-screen overflow-y-hidden">
        <h1 className="mt-4 text-center text-3xl font-bold">Admin Product Management</h1>
        {loading && (
            <p>Loading all available products...</p>
        )}

        {error && (
            <p>{error}</p>
        )}

        {!loading && !error && products.length>0 && (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {products.map((product)=>(
                    <div key={product._id} className="bg-white p-8 m-8 rounded-lg shadow-lg">
                        <p className="mt-4"><span className="font-semibold">Product Name:{" "}</span>{product.name}</p>
                        <p className="mt-4"><span className="font-semibold">Product Description:{" "}</span>{product.description}</p>
                        <p className="mt-4"><span className="font-semibold">Product Category:{" "}</span>{product.category}</p>
                        <p className="mt-4"><span className="font-semibold">Product Price:{" "}</span>₹ {product.price}</p>
                        <p className="mt-4"><span className="font-semibold">Product Stock:{" "}</span>{product.stock}</p>
                        <div className="mt-3 border-t pt-3">
                            <h2 className="font-bold">Product Owner</h2>
                            <p className="mt-2"><span className="font-semibold">Owner Name:{" "}</span>{product.ownerId.name}</p>
                            <p className="mt-2"><span className="font-semibold">Owner Email:{" "}</span>{product.ownerId.email}</p>
                            <p className="mt-2"><span className="font-semibold">Owner Role:{" "}</span>{product.ownerId.role}</p>
                        </div>
                        <p className="mt-2"><span className="font-semibold">Number of Certifications:{" "}</span>{product.certifications.length}</p>
                        <div className="mt-4">
                            <button onClick={()=>handleDeleteProduct(product._id)} className="w-full bg-red-950 text-white hover:bg-red-800 cursor-pointer rounded-lg">Delete Product</button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {isAuthenticated ? (
            <Navbar showLogin={false} showSignup={false}/>
        ):(
        <Navbar />
        )}
    </main>
    </>
  )
}

export default AdminProducts