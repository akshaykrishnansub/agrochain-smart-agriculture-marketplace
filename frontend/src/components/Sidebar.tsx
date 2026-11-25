import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps{
    collapsed:boolean;
    onToggle:()=>void;
    mobileOpen:boolean;
    onClose:()=>void;
}

const Sidebar = ({collapsed,onToggle,mobileOpen,onClose}:SidebarProps) => {
    const {user}=useAuth();
    if(!user){
        return null;
    }

    const nameParts=user.name.split(" ");
    const initials=nameParts.length>1?(nameParts[0][0]+nameParts[1][0]).toUpperCase():nameParts[0][0];

    let navItems:{label:string;path:string}[]=[];

    if(user.role==="buyer"){
        navItems=[
            {label:"Products",path:"/products"},
            {label:"My Orders",path:"/my-orders"},
            {label:"Profile",path:"/profile"}
        ];
    }else if(user.role==="farmer"||user.role==="supplier"){
        navItems=[
            {label:"My Products",path:"/my-products"},
            {label:"Received Orders",path:"/received-orders"},
            {label:"MarketPlace",path:"/products"},
            {label:"Profile",path:"/profile"}
        ];
    }else if(user.role==="admin"){
        navItems=[
            {label:"Analytics",path:"/admin-dashboard"},
            {label:"Users",path:"/admin-user"},
            {label:"Products",path:"/admin-product"},
            {label:"Orders",path:"/admin-orders"},
            {label:"Certifications",path:"/admin-certifications"},
            {label:"Profile",path:"/profile"},
        ]
    }
  return (
    <>
    {mobileOpen && (
        <div 
        className="fixed inset-0 top-16 bg-black/40 z-30 md:hidden"
        onClick={onClose}
        />
    )}
    <aside className={`fixed left-0 top-16 bottom-0 z-40 ${mobileOpen?"translate-x-0":"-translate-x-full"} md:translate-x-0 w-64 ${collapsed?"md:w-20":"md:w-64"} bg-white border-r shadow-sm overflow-y-auto transition-all duration-300`}>
        <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-green-950 text-white flex items-center justify-center font-bold shrink-0">
                {initials}
            </div>
            <span className={`font-semibold text-gray-800 ${collapsed?"md:hidden":""}`}>{user.name}</span>
        </div>
        <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
                <h2 className="font-bold text-gray-700">Navigation</h2>
            )}
            <button type="button" onClick={onToggle} className="hidden md:block p-2 rounded hover:bg-gray-100" aria-label={collapsed?"Expand sidebar":"Collapse Sidebar"}>{collapsed?"→":"←"}</button>
        </div>

        <nav className="p-3 space-y-2">
            {navItems.map((item)=>(
                <NavLink 
                key={item.path} 
                to={item.path} 
                onClick={onClose}
                end={item.path==="/products"}
                title={collapsed?item.label:""}
                className={({isActive})=>`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive?"bg-green-100 text-green-950 font-semibold":"text-gray-600 hover:bg-gray-100"}`}
                >
                    <span className="w-8 h-8 shrink-0 rounded-md bg-green-50 flex items-center justify-center font-semibold text-green-800">{item.label.charAt(0)}</span>
                    <span className={collapsed?"md:hidden":""}>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    </aside>
    </>

  )
}

export default Sidebar