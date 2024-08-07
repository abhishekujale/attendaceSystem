import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { newAdminSheet } from "../../store/sheetAtom"
import { useState } from "react"
import AdminForm, { AdminFormInput } from "../forms/AdminForm"
import axios from "axios"
import { toast } from "react-toastify"
import adminsAtom from "@/store/adminsAtom"

export type NewAdminErrorMessages ={
    email?:string,
    password?:string,
    [key: string]: string | undefined;
}
const NewAdminSheet = () => {
    const setAdmins = useSetRecoilState(adminsAtom)
    const [isOpen,setIsOpen] = useRecoilState(newAdminSheet)
    const onClose = () => setIsOpen(false)
    const [values,setValues] = useState({
        email:'',
        password:''
    })
    const setValue = (newValues:Partial<AdminFormInput>) =>{
        setValues((values)=>({
            ...values,
            ...newValues
        }))
    }
    const [errors,setErrors] = useState<NewAdminErrorMessages>({})
    const [isLoading,setIsLoading] = useState(false)
    const addAdmin = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setValues({
                    email:'',
                    password:''
                })
                setAdmins((prev)=>([...prev,response.data.data]))
                onClose()
                toast.success(response?.data.message);
            } else {
              toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } 
            else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };
    
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Admin
                    </SheetTitle>
                    <SheetDescription>
                        Create a new admin.
                    </SheetDescription>
                </SheetHeader>
                <AdminForm
                    values={values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{}}
                    onSubmit={addAdmin}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default NewAdminSheet