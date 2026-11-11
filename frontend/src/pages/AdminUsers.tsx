import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

interface User{
    _id:string;
    name:string;
    email:string;
    role:"buyer"|"admin"|"farmer"|"supplier";
    certifications:string[];
}

const AdminUsers = () => {
    const [users,setUsers]=useState<User[]>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string>("");
    const [showRoleEditModal,setShowRoleEditModal]=useState<boolean>(false);
    const [role,setRole]=useState<string>("");
    const [editingUser,setEditingUser]=useState<User|null>(null)
    const {isAuthenticated}=useAuth();

    useEffect(()=>{
        const fetchUsers=async()=>{
            try{
                const res=await fetch(`http://localhost:5000/api/admin/users`,{
                    method:"GET",
                    credentials:"include"
                })

                const data=await res.json();
                if(!res.ok){
                    throw new Error(data.message || "Failed to fetch users");
                }

                setUsers(data.users);
            }catch(err){
                setError("Unable to load users");
            }finally{
                setLoading(false);
            }
        }

        fetchUsers();
    },[])

    const handleRoleUpdate=async(userId:string)=>{
        try{
            const res=await fetch(`http://localhost:5000/api/admin/users/${userId}/role`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({role})
            })

            const data=await res.json();
            if(!res.ok){
                throw new Error(data.message||"Failed to update user role");
            }

            setUsers(users.map((user)=>(
                user._id===userId?{...user,role:role as User["role"]}:user
            )))

            setShowRoleEditModal(false);
        }catch(err){
            setError("Unable to update role");
        }
    }

    const handleDeleteUser=async(userId:string)=>{
        if(!window.confirm("Are you sure you want to delete this user?")){
            return;
        }
        try{
            const res=await fetch(`http://localhost:5000/api/admin/users/${userId}`,{
                method:"DELETE",
                credentials:"include"
            })

            const data=await res.json();
            console.log("Delete user response:", data);
            if(!res.ok){
                throw new Error(data.message||"Failed to delete user");
            }

            setUsers(users.filter((user)=>user._id!==userId));
        }catch(err){
            setError("Unable to delete user");
        }
    }

  return (
    <>
    <title>AgroChain | Admin User Management</title>
    <Navbar />
    <main className="bg-green-50 min-h-screen pt-16">
        <h1 className="text-center font-bold m-4 text-3xl">Admin User Management</h1>
        {loading && (
            <p>Loading User Data...</p>
        )}

        {!loading && error && (
            <p>{error}</p>
        )}

        {!loading && !error && users.length>0 &&(
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {users.map((user)=>(
                    <div key={user._id} className="bg-white p-8 m-8 rounded-lg shadow-lg">
                        <p className="mt-2"><span className="font-semibold">Username:{" "}</span>{user.name}</p>
                        <p className="mt-2"><span className="font-semibold">User Email:{" "}</span>{user.email}</p>
                        <p className="mt-2"><span className="font-semibold">Role:{" "}</span>{user.role}</p>
                        <p className="mt-2"><span className="font-semibold">Number of certifications:{" "}</span>{user.certifications.length ||0}</p>
                        <div className="flex gap-4 mt-4">
                            <button onClick={()=>{setEditingUser(user);setRole(user.role);setShowRoleEditModal(true)}} className="bg-green-950 text-white p-2 hover:bg-green-800 cursor-pointer">Change Role</button>
                            <button onClick={()=>{handleDeleteUser(user._id)}} className="bg-red-950 text-white p-2 hover:bg-red-800 cursor-pointer">Delete User</button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {showRoleEditModal && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white w-96 max-h-[90vh] p-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-center font-bold">Admin Role Edit</h2>
                        <button onClick={()=>setShowRoleEditModal(false)} className="">X</button>
                    </div>
                    <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full rounded-lg mt-4 border">
                        <option value="buyer">Buyer</option>
                        <option value="farmer">Farmer</option>
                        <option value="supplier">Supplier</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="mt-4">
                        <button onClick={()=>handleRoleUpdate(editingUser!._id)} className="w-full bg-blue-950 text-white hover:bg-blue-800 cursor-pointer rounded-lg p-2">Save Role Changes</button>
                    </div>
                </div>
            </div>
        )}
        

        {isAuthenticated ?(
            <Navbar showLogin={false} showSignup={false}/>
        ):(
            <Navbar/>
        )}
    </main>
    </>
  )
}

export default AdminUsers