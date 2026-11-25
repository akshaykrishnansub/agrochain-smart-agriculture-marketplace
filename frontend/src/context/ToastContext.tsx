import { createContext, useContext, useEffect,useState, type ReactNode } from "react";
import Toast from "../components/Toast";

interface ToastContextType{
    showToast:(message:string,type:"success"|"error"|"info")=>void;
}

const ToastContext=createContext<ToastContextType|null>(null);

export const ToastProvider=({children}:{children:ReactNode})=>{
    const [toast,setToast]=useState<{message:string;type:"success"|"error"|"info"}|null>(null);
    const [isExiting,setIsExiting]=useState<boolean>(false);
    const showToast=(message:string,type:"success"|"error"|"info")=>{
        setIsExiting(false);
        setToast({message,type});
    }

    useEffect(()=>{
        if(!toast){
            return;
        }

        const timer=setTimeout(()=>{
            setIsExiting(true);
        },3000);

        return ()=>clearTimeout(timer);
    },[toast]);

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            {toast && <Toast message={toast.message} type={toast.type} isExiting={isExiting} onTransitionEnd={()=>setToast(null)}/>}
        </ToastContext.Provider>
    )
}

export const useToast=()=>{
    const context=useContext(ToastContext);
    if(!context){
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}