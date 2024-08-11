import { useLocation, useNavigate } from "react-router-dom"
import NavigationButton from "./NavigationButton"
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "../../ui/sheet"
import { useMedia } from "react-use"
import { useState } from "react"
import { Button } from "../../ui/button"
import { Menu } from "lucide-react"
import { useRecoilValue } from "recoil"
import userAtom from "@/store/userAtom"
import adminAtom from "@/store/adminAtom"

const Navigation = () => {
    const user = useRecoilValue(userAtom)
    const admin = useRecoilValue(adminAtom)
    const pathname = useLocation().pathname
    const [open,setOpen]=useState(false)
    const isMobile = useMedia("( max-width : 1024px )" ,false)
    const navigate = useNavigate()
    const onClick = (href:string) =>{
        navigate(href)
        setOpen(false)
    }
    console.log(user.role)
    let routes = !!user.id && user.role === 'user' ? [
        {
            href:'/userdashboard',
            label:'Dashboard'
        },
    ] : !!admin.id && admin.role === 'admin' ? [
        {
            href:'/dashboard',
            label:'Dashboard'
        },
        {
            href:'/events',
            label:'Events'
        },
    ] : !!admin.id && admin.role === 'superAdmin' ?  
    [
        {
            href:'/dashboard',
            label:'Dashboard'
        },
        {
            href:'/events',
            label:'Events'
        },
        {
            href:'/admins',
            label:'Admins'
        },
    ]:[];
    if(isMobile)
    {
        return(
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white focus:bg-white/30 transition"
                    >
                        <Menu className="size-4"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 p-6">
                        {routes.map((route)=>(
                            <Button
                                key={route.label}
                                variant={route.href===pathname ? 'secondary' : 'ghost'}
                                onClick={()=>onClick(route.href)}
                                className="w-full justify-start"
                            >
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }
    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route)=>(
                <NavigationButton key={route.label} {...route} isActive={pathname===route.href}/>
            ))}
        </nav>
    )
}

export default Navigation