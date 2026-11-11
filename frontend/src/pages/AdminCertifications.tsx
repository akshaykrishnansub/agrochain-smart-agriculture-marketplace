import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

interface ProductOwner{
    _id:string;
    name:string;
    description:string;
    price:number;
    images:string[];
    ownerId:string;
    category:string;
    certifications:string[];
    stock:number;
    createdAt:string;
    updatedAt:string;
}

interface UserOwner{
    _id:string;
    name:string;
    email:string;
    role:"buyer"|"farmer"|"supplier"|"admin";
    certifications:string[];
}

interface Certification{
    _id:string;
    ownerType:"Product"|"User";
    ownerId:ProductOwner|UserOwner|null;
    fileUrl:string;
    status:"PENDING"|"REJECTED"|"APPROVED";
    reviewedAt:string;
    rejectionReason:string;
    createdAt:string;
    updatedAt:string;
}

const AdminCertifications = () => {
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string>("");
    const [certifications,setCertifications]=useState<Certification[]>([]);
    const [showRejectModal,setShowRejectModal]=useState<boolean>(false);
    const [editingCertification,setEditingCertification]=useState<Certification|null>(null);
    const [rejectionReason,setRejectionReason]=useState<string>("");
    const {isAuthenticated}=useAuth();

    useEffect(()=>{
        const fetchCertification=async()=>{
            try{
                const res=await fetch(`http://localhost:5000/api/admin/certifications`,{
                    method:"GET",
                    credentials:"include"
                })

                const data=await res.json();
                if(!res.ok){
                    throw new Error(data.message||"Failed to fetch certifications");
                }

                setCertifications(data.certifications);

            }catch(err){
                setError("Unable to fetch certifications");
            }finally{
                setLoading(false);
            }
        }

        fetchCertification();
    },[]);

    const handleApprove=async(certificationId:string)=>{
        try{
            const res=await fetch(`http://localhost:5000/api/admin/certifications/${certificationId}/review`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({status:"APPROVED"})
            })

            const data=await res.json();
            if(!res.ok){
                throw new Error(data.message||"Failed to approve certification status");
            }

            setCertifications(certifications.map((certification)=>(
                certification._id===certificationId?{...certification,...data.certification}:certification
            )))
        }catch(err){
            setError("Unable to approve certification");
        }
    }

    const handleReject=async()=>{
        if(!editingCertification){
            return;
        }

        try{
            const res=await fetch(`http://localhost:5000/api/admin/certifications/${editingCertification._id}/review`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({status:"REJECTED",rejectionReason})
            })

            const data=await res.json();
            if(!res.ok){
                throw new Error(data.message||"Failed to reject certification");
            }

            setCertifications(certifications.map((certification)=>(
                certification._id===editingCertification._id?{...certification,...data.certification}:certification
            )))

            setShowRejectModal(false);
            setEditingCertification(null);
            setRejectionReason("");

        }catch(err){
            setError("Unable to reject certification");
        }
    }

  return (
    <>
    <title>AgroChain | Admin Certifications</title>
    <Navbar />
    <main className="pt-16 bg-green-50 overflow-y-hidden min-h-screen">
        <h1 className="mt-4 text-center text-3xl font-bold">Admin Certification Management</h1>
        {loading && (
            <p>Loading certifications...</p>
        )}

        {error && (
            <p>{error}</p>
        )}

        {!loading && !error && certifications.length===0 && (
            <div>
                <p>No certifications to display..</p>
            </div>
        )}

        {!loading && !error && certifications.length > 0 && (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {certifications.map((certification)=>(
                    <div key={certification._id} className="bg-white p-8 m-8 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-center border-b border-b-green-950">Certification Details</h2>
                        <p className="mt-4"><span className="font-semibold">Certification ID:{" "}</span>{certification._id}</p>
                        <p className="mt-2"><span className="font-semibold">Owner Type:{" "}</span>{certification.ownerType}</p>
                        <div className="mt-4">
                            <h3 className="font-bold">Owner Details</h3>
                            {certification.ownerId?(
                                <>
                                {certification.ownerType==="Product" &&(
                                    <>
                                    <p className="mt-2"><span className="font-semibold">Product Name:{" "}</span>{certification.ownerId.name}</p>
                                    <p className="mt-2"><span className="font-semibold">Category:{" "}</span>{"category" in certification.ownerId?certification.ownerId.category:""}</p>
                                    </>
                                )}

                                {certification.ownerType==="User" && (
                                    <>
                                    <p className="mt-2"><span className="font-semibold">Name:{" "}</span>{certification.ownerId.name}</p>
                                    <p className="mt-2"><span className="font-semibold">Email:{" "}</span>{"email" in certification.ownerId?certification.ownerId.email:""}</p>
                                    </>
                                )}
                                </>
                            ):(
                                <p>Owner record unavailable </p>
                            )}
                        </div>
                        <p className="mt-4"><span className="font-semibold">Submitted On:{" "}</span>{new Date(certification.createdAt).toLocaleDateString("en-IN")}</p>
                        <p className="mt-2"><span className="font-semibold">Review Status:{" "}</span>{certification.status}</p>
                        <p className="mt-2"><span className="font-semibold">Document:{" "}</span>
                        <a href={certification.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a>
                        </p>
                        {certification.status==="REJECTED"  && (
                            <p className="mt-2"><span className="font-semibold">Rejection Reason:{" "}</span>{certification.rejectionReason}</p>
                        )}

                        {certification.status==="APPROVED" && (
                            <p className="mt-2"><span className="font-semibold">Reviewed On:{" "}</span>{new Date(certification.reviewedAt).toLocaleDateString("en-IN")}</p>
                        )}
                        {certification.status==="PENDING" &&(
                            <div className="flex gap-3">
                                <button onClick={()=>handleApprove(certification._id)} className="mt-4 bg-green-950 text-white px-2 rounded-lg hover:bg-green-800 cursor-pointer">Approve</button>
                                <button onClick={()=>{setEditingCertification(certification);setRejectionReason("");setShowRejectModal(true)}} className="mt-4 bg-red-950 text-white px-2 rounded-lg hover:bg-red-800 cursor-pointer">Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {isAuthenticated ? (
            <Navbar showLogin={false} showSignup={false}/>
        ):(
            <Navbar />
        )}
        {showRejectModal && editingCertification && (
            <div className="fixed inset-0 bg-black/25 flex justify-center items-center">
                <div className="w-96 bg-white max-h-[90vh] p-2 m-5">
                    <h2 className="text-2xl font-bold text-center mt-4">Admin Reject Certification</h2>
                    <p className="mt-4"><span className="font-semibold">Certification ID:{" "}</span>{editingCertification._id}</p>
                    <div className="mt-4">
                        <label htmlFor="rejectionReason" className="font-semibold">Rejection Reason:</label>
                        <textarea name="rejectionReason" 
                        value={rejectionReason} 
                        onChange={(e)=>setRejectionReason(e.target.value)} 
                        placeholder="Enter a reason for rejection..."
                        className="w-full border border-green-950 rounded-lg p-2"></textarea>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button onClick={handleReject} disabled={!rejectionReason.trim()} className="bg-green-950 text-white p-2 rounded-lg hover:bg-green-800 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">Reject Certification</button>
                        <button onClick={()=>setShowRejectModal(false)}className="bg-red-950 text-white p-2 rounded-lg hover:bg-red-800 cursor-pointer">Cancel</button>
                    </div>
                    
                </div>
            </div>
        )}
    </main>
    </>
  )
}

export default AdminCertifications