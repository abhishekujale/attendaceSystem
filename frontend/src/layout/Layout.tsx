import { ReactNode } from "react"
import SheetProvider from "@/components/providers/SheetProvider"
import DialogueProvider from "@/components/providers/DialogueProvider"
import Header from "@/components/general/header/Header"

type LayoutProps ={
    children:ReactNode
}

const Layout = ({children}:LayoutProps) => {
  return (
    <>
        <SheetProvider />
        <DialogueProvider />
        <Header />
        <main  className="px-4 lg:px-14">
            {children}
        </main>
    </>
    
  )
}

export default Layout