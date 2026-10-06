import { createContext,useContext,useEffect,useState,type ReactNode } from "react";

interface User{
    id:string;
    name:string;
    email:string;
    role:"buyer"|"supplier"|"farmer"|"admin";

}

interface AuthContextType{
    user:User|null;
    isAuthenticated:boolean;
    loading:boolean;
    setUser:(user:User|null)=>void; //setuser is a function that accepts user or null and returns nothing
}

const AuthContext=createContext<AuthContextType|undefined>(undefined);

export const AuthProvider=({children}:{children:ReactNode})=>{
    const [user,setUser]=useState<User|null>(null);
    const [loading,setLoading]=useState<boolean>(true);
    useEffect(()=>{
        const checkAuthentication=async()=>{
            try{
                const response=await fetch(`http://localhost:5000/api/auth/profile`,{
                    method:"GET",
                    credentials:"include"
                })

                if(!response.ok){
                    setUser(null);
                    return;
                }

                const data=await response.json();
                setUser(data.user);
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        }
        checkAuthentication();
    },[])

    let isAuthenticated=false;

    if(user!==null){
        isAuthenticated=true;
    }

    return (
        <AuthContext.Provider value={{user,isAuthenticated,loading,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}