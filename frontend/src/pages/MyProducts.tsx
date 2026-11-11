import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";

 interface Product{
     _id:string;
     name:string;
     description:string;
     price:number;
     images:string[];
     certifications:string[];
     category:string;
     stock:number;
 }

const MyProducts = () => {
    const [products,setProducts]=useState<Product[]>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string>("");
    const [showModal,setShowModal]=useState<boolean>(false);
    const [editingProduct,setEditingProduct]=useState<Product|null>(null);
    const [showEditModal,setShowEditModal]=useState<boolean>(false)

    const {isAuthenticated}=useAuth();

    const [formData,setFormData]=useState({
        name:"",
        description:"",
        price:"",
        category:"",
        stock:"0",
        images:[] as File[],
        certifications:[] as File[]
    })

    const handleEdit=(product:Product)=>{
        setEditingProduct(product);

        setFormData({
            name:product.name,
            description:product.description,
            stock:String(product.stock),
            category:product.category,
            price:String(product.price),
            images:[],
            certifications:[]
        })

        setShowEditModal(true);
    }

    const handleChange=(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name,value}=event.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,files}=event.target;
        if(files){
            setFormData({
                ...formData,
                [name]:Array.from(files) //converts a file list into a standard javascript object 
            })
        }
    }

    const handleDelete=async(productId:string)=>{
        try{
            const res=await fetch(`http://localhost:5000/api/products/${productId}`,{
                method:"DELETE",
                credentials:"include"
            })

            const data=await res.json();
            if(!res.ok){
                throw new Error(data.message||"Unable to delete the product");
            }

            setProducts(products.filter(product=>product._id!==productId))
        }catch(err){
            console.error(err);
        }
    }

    const handleUpdate=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();

        if(!editingProduct){
            return;
        }

        try{
            setError("");

            const imageUrls:string[]=[];
            const certificationUrls:string[]=[];

            //upload only selected images
            if(formData.images.length>0){
                for(const image of formData.images){
                    const uploadData=new FormData();
                    uploadData.append("file",image);

                    const res=await fetch(`http://localhost:5000/api/upload`,{
                        method:"POST",
                        credentials:"include",
                        body:uploadData
                    })

                    const data=await res.json();

                    if(!res.ok){
                        console.error(data.message || "Image upload failed");
                    }

                    imageUrls.push(data.fileUrl);
                }
            }

            console.log(formData.certifications);
            //Upload only selected certifications
            if(formData.certifications.length>0){
                for(const certification of formData.certifications){
                    const uploadData=new FormData();
                    uploadData.append("file",certification);

                    const res=await fetch(`http://localhost:5000/api/upload`,{
                        method:"POST",
                        credentials:"include",
                        body:uploadData
                    })

                    const data=await res.json();

                    if(!res.ok){
                        console.error(data.message||"Failed to upload certification");
                    }

                    certificationUrls.push(data.fileUrl);
                }  
            }

            const res=await fetch(`http://localhost:5000/api/products/${editingProduct._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                  name:formData.name,
                  description:formData.description,
                  price:Number(formData.price),
                  category:formData.category,
                  stock:Number(formData.stock),
                  images:imageUrls.length>0?imageUrls:editingProduct.images,
                  certifications:certificationUrls.length>0?certificationUrls:editingProduct.certifications
                })
            })

            console.log(certificationUrls);

            const data=await res.json();
            if(!res.ok){
                console.error(data.message || "Product update failed");
            }

            setProducts(products.map((product)=>(
                product._id===editingProduct._id?data.product:product
            )))

            setShowEditModal(false);
            setEditingProduct(null);
        }catch(err){
            setError("Something went wrong");
        }
    }

    const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        try{
            setError("");

            //function to upload files
            const uploadFiles=async(files:File[])=>{
                const urls:string[]=[];
                for(const file of files){
                    const uploadData=new FormData();
                    uploadData.append("file",file);
                    const res=await fetch(`http://localhost:5000/api/upload`,{
                        method:"POST",
                        credentials:"include",
                        body:uploadData
                    })

                    const data=await res.json();
                    if(!res.ok){
                        console.error(data.message||"File upload failed");
                    }

                    urls.push(data.fileUrl);

                }

                return urls;
            }

            const imageUrls=await uploadFiles(formData.images);
            const certificationUrls=await uploadFiles(formData.certifications);

            const res=await fetch(`http://localhost:5000/api/products`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                    ...formData,
                    price:Number(formData.price),
                    stock:Number(formData.stock),
                    images:imageUrls,
                    certifications:certificationUrls
                })
            })

            const data=await res.json();
            if(!res.ok){
                console.error(data.message||"Product creation failed");
            }

            setProducts([...products,data.product]); //keep or preserve the existing products and add a new product
            setShowModal(false);

            setFormData({
                name:"",
                description:"",
                price:"",
                category:"",
                stock:"0",
                images:[],
                certifications:[]
            })
        }catch(err){
            setError("Something went wrong");
        }
    }

    useEffect(()=>{
        const fetchMyProducts=async()=>{
            try{
                const res=await fetch(`http://localhost:5000/api/products/my-products`,{
                    method:"GET",
                    credentials:"include"
                })

                const data=await res.json();

                if(!res.ok){
                    console.error(data.message||"Failed to fetch own products");
                }

                setProducts(data.products);
            }catch(err){
                setError("Something went wrong");
            }finally{
                setLoading(false);
            }
        }

        fetchMyProducts();
    },[])

  return (
    <>
    <title>AgroChain | My Products</title>
    <Navbar/>
    <main className="bg-green-50 min-h-screen overflow-y-hidden pt-16">
        <div className="m-2.5 flex items-center justify-between">
            <h1 className="text-center font-bold text-3xl">My Products</h1>
            <button onClick={()=>setShowModal(true)} className="bg-blue-950 hover:bg-blue-800 p-2 rounded-lg cursor-pointer text-white">+ Add Product</button>
        </div>
        {loading && (
            <p>Loading your products...</p>
        )}

        {!loading && error && (
            <p>{error}</p>
        )}

        {!loading && !error && products.length===0 && (
            <p>You do not have any products yet..</p>
        )}

        {!loading && !error && products.length>0 && (
            <div className="grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product)=>(
                    <div key={product._id} className="bg-white shadow-sm m-4">
                        {product.images?.[0] && (
                            <img src={product.images[0]} alt={product.name} className="h-60 w-full object-cover rounded"/>
                        )}
                        <div className="p-5">
                            <p className="mt-1"><span className="font-bold">Product Name:{" "}</span>{product.name}</p>
                            <p className="mt-1"><span className="font-bold">Product Category:{" "}</span>{product.category}</p>
                            <p className="mt-1"><span className="font-bold">Product Description:{" "}</span>{product.description}</p>
                            <p className="mt-1"><span className="font-bold">Product Price:{" "}</span>₹ {product.price.toFixed(2)}</p>
                            <p className="mt-1"><span className="font-bold">Product Stock:{" "}</span>{product.stock}</p>
                            <div className="mt-4 flex gap-5">
                                <button onClick={()=>handleEdit(product)} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-400">Edit</button>
                                <button onClick={()=>handleDelete(product._id)} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
        {isAuthenticated?(
            <Navbar showLogin={false} showSignup={false} />
        ):(
        <Navbar />)}

        {showModal && (
            <div className="bg-black/50 fixed inset-0 flex justify-center items-center">
                <div className=" bg-white max-h-[90vh] overflow-y-auto w-96 sm p-2 m-4 rounded">
                    <div className="flex justify-between items-center">
                        <h1 className="text-center text-2xl font-semibold">Add Product</h1>
                        <button onClick={()=>setShowModal(false)} className="text-red-950 hover:text-red-800 cursor-pointer">X</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label htmlFor="productName" className="font-semibold">Product Name:</label>
                            <input type="text" 
                            name="name" 
                            placeholder="Enter your product name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded border border-green-900" required/>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="description" className="font-semibold">Description:</label>
                            <textarea name="description"
                            placeholder="Enter the Product Description here"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3} className="w-full border border-green-900 rounded p-2" required></textarea>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="price" className="font-bold">Product Price (₹):</label>
                            <input type="number" 
                            placeholder="Enter your Product Price"
                            value={formData.price}
                            onChange={handleChange}
                            name="price" min={0} className="w-full border border-green-900 rounded p-2" required/>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="category" className="font-bold">Product Category:</label>
                            <input type="text"
                            placeholder="Enter the category"
                            value={formData.category}
                            onChange={handleChange}
                            name="category" className="w-full border border-green-900 rounded p-2" required />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="stock" className="font-bold">Stock:</label>
                            <input type="number"
                            placeholder="Enter your stock"
                            value={formData.stock}
                            onChange={handleChange}
                            name="stock" min={0} className="w-full border border-green-900 rounded p-2" required/>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="productImages">Product Images:</label>
                            <input type="file" 
                            onChange={handleFileChange}
                            name="images" 
                            accept="image/png,image/jpeg,image/webp" 
                            multiple className="w-full border border-green-900 rounded p-2" required/>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="certificationdocs">Certification Documents:</label>
                            <input type="file"
                            onChange={handleFileChange}
                            name="certifications" 
                            accept="application/pdf" 
                            multiple className="w-full border border-green-900 rounded p-2" required />
                        </div>
                        <div className="mt-2">
                            <button type="submit" className="w-full bg-blue-950 text-white p-2 rounded hover:bg-blue-800 cursor-pointer">Create Product</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {showEditModal && editingProduct &&(
            <div className="bg-black/50 fixed inset-0 flex justify-center items-center">
                <div className="w-96 max-h-[90vh] bg-white p-2 m-4 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Edit Product</h1>
                        <button onClick={()=>setShowEditModal(false)} className="text-red-950 hover:text-red-700 cursor-pointer">X</button>
                    </div>
                    <form onSubmit={handleUpdate}>
                        <div className="mt-4">
                            <label htmlFor="productName" className="font-bold">Product Name:</label>
                            <input type="text" 
                            name="name" 
                            placeholder="Enter the product name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-green-950" />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="description" className="font-bold">Product Description:</label>
                            <textarea name="description" rows={3} placeholder="Enter a description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-green-950"></textarea>
                        </div>
                        <div>
                            <label htmlFor="price" className="font-bold">Product Price (₹):</label>
                            <input type="number" 
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min={0}
                            className="w-full p-2 border border-green-950"
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="category" className="font-bold">Product Category:</label>
                            <input type="text" 
                            name="category" 
                            placeholder="Enter the product category here"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border border-green-950"
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="stock" className="font-bold">Stock:</label>
                            <input type="number"
                            name="stock"
                            placeholder="Enter the stock here"
                            value={formData.stock}
                            onChange={handleChange}
                            min={0}
                            className="w-full p-2 border border-green-950"
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="images" className="font-bold">Product Images</label>
                            <input type="file"
                            name="images"
                            onChange={handleFileChange}
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            className="w-full border p-2 border-green-950"
                            />
                            {editingProduct.images.map((image,index)=>(
                                <img key={index} src={image} alt={`Product Image ${index+1}`} className="w-20 h-20 object-cover mt-2"/>))}
                        </div>
                        <div className="mt-2">
                            <label htmlFor="certifications">Product Certifications:</label>
                            <input type="file"
                            name="certifications"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            multiple
                            className="w-full p-2 border border-green-950"
                            />
                            {editingProduct.certifications.map((certification,index)=>(
                                <div key={index} className="mt-2">
                                    <a href={certification} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Certification {index+1}</a>
                                </div>
                            ))}
                            <div className="mt-2">
                                <button className="w-full p-2 bg-blue-950 text-white hover:bg-blue-800">Update Product</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </main>
    </>
  )
}

export default MyProducts