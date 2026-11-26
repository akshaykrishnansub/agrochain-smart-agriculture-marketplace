import { useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config";

const Profile = () => {
  const [isEditing,setIsEditing]=useState<boolean>(false);
  const [name,setName]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const {user,loading,isAuthenticated,setUser}=useAuth();
  const [certificationFile,setCertificationFile]=useState<File|null>(null);
  const [uploading,setUploading]=useState<boolean>(false);
  const {showToast}=useToast();

  const handleSave=async(id:string)=>{
    try{
      const res=await fetch(`${API_URL}/api/auth/profile/${id}`,{
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

  const handleCertificationUpload=async()=>{
    if(!certificationFile || !user){
      return;
    }
    setUploading(true);

    try{
      const formData=new FormData();
      formData.append("file",certificationFile);

      const uploadRes=await fetch(`${API_URL}/api/upload`,{
        method:"POST",
        credentials:"include",
        body:formData
      })

      const uploadData=await uploadRes.json();

      if(!uploadRes.ok){
        throw new Error(uploadData.message || "Failed to upload certifications");
      }

      const certificationRes=await fetch(`${API_URL}/api/users/${user.id}/certifications`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({certificationUrl:uploadData.fileUrl})
      })

      const certificationData=await certificationRes.json();
      if(!certificationRes.ok){
        throw new Error(certificationData.message || "Failed to save certification");
      }
      setUser({...user,certifications:[...(user.certifications || []),uploadData.fileUrl]});
      setCertificationFile(null);
      showToast("Certification uploaded successfully","success");
    }catch(err){
      console.error(err);
      showToast("Unable to upload certification","error");
    }finally{
      setUploading(false);
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
          {(user.role==="farmer" || user.role==="supplier") && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Upload Certification:</h2>
              <input type="file" 
              accept=".pdf"
              onChange={(e)=>setCertificationFile(e.target.files?.[0]||null)}
              className="w-full mt-2 border border-green-950 rounded-lg p-2"
              />
              <button onClick={handleCertificationUpload} disabled={!certificationFile||uploading} className="w-full mt-3 bg-green-950 text-white hover:bg-green-800 cursor-pointer p-2 rounded-lg disabled:opacity-50">{uploading ?"Uploading" :"Upload Certification"}</button>
            </div>
          )}

          {(user.role==="farmer"||user.role==="supplier") && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">My Certifications:</h2>
              {user.certifications && user.certifications.length>0 && (
                <div className="mt-2 space-y-2">
                  {user.certifications.map((certification,index)=>(
                    <div key={index} className="border border-green-950 rounded-lg p-3">
                      <a href={certification} target="_blank" rel="noopener noreferrer" className="text-green-800 underline hover:text-green-600">View Certification {index + 1}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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