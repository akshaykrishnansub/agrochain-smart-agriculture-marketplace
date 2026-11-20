import { useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [isEditing,setIsEditing]=useState<boolean>(false);
  const [name,setName]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const {user,loading,isAuthenticated,setUser}=useAuth();

  const handleSave=async(id:string)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/auth/profile/${id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({name,email})
      })

      const data=await res.json();
      if(!res.ok){
        throw new Error(data.message || "Failed to save changes");
      }

      setUser({...user!,name,email});
      setIsEditing(false);
    }catch(err){
      console.error(err);
    }
  }

  return (
    <>
    <title>AgroChain | My Profile</title>
    <Navbar/>
    <main className="bg-green-50 pt-16 min-h-screen">
      <h1 className="text-center mt-4 font-bold text-3xl">My Profile</h1>

      {loading && (
        <p>Loading Profile...</p>
      )}

      {!loading && (!user || !isAuthenticated) && (
        <p>Please login to view your profile...</p>
      )}

      {!loading && user && isAuthenticated && !isEditing && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4 m-6">
          <div className="mt-4">
            <p className="text-xl font-semibold">Name:</p>
            <p className="text-xl font-normal">{user.name}</p>
          </div>
          <div className="mt-2">
            <p className="text-xl font-semibold">Email:</p>
            <p className="text-xl font-normal">{user.email}</p>
          </div>
          <div className="mt-2">
            <p className="text-xl font-semibold">Role:</p>
            <p className="text-xl font-normal">{user.role}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={()=>{setName(user.name);setEmail(user.email);setIsEditing(true)}} className="w-full bg-green-950 text-white hover:bg-green-800 cursor-pointer p-2 rounded-lg">Edit Profile</button>
          </div>
        </div>
      )}

      {!loading && user && isAuthenticated && isEditing && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4 m-6">
          <div>
            <label htmlFor="name" className="text-xl font-semibold mb-2">Name:</label>
            <input type="text" 
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full border border-green-950 rounded-lg p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-xl font-semibold mb-2">Email:</label>
            <input type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border border-green-950 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={()=>handleSave(user.id)} className="w-full bg-green-950 text-white hover:bg-green-800 cursor-pointer p-2 rounded-lg">Save Changes</button>
            <button onClick={()=>setIsEditing(false)} className="w-full bg-red-950 text-white hover:bg-red-800 cursor-pointer p-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <Navbar showLogin={false} showSignup={false}/>
      )}
    </main>
    </>
  )
}

export default Profile