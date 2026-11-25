interface ToastProps{
    message:string;
    type:"success"|"error"|"info";
    isExiting:boolean;
    onTransitionEnd:()=>void;
}

const Toast=({message,type,isExiting,onTransitionEnd}:ToastProps)=>{
    return (
        <div onTransitionEnd={isExiting?onTransitionEnd:undefined} className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out ${type==="success"?"bg-green-900":type==="error"?"bg-red-900":"bg-blue-700"}
        ${isExiting?"translate-x-full opacity-0":"translate-x-0 opacity-100"}
        `}>
            {message}
        </div>
    )
}

export default Toast