import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { editAdminSheet } from "../../store/sheetAtom"
import { useState } from "react"
import AdminForm, { AdminFormInput } from "../forms/AdminForm"
import axios from "axios"
import { toast } from "react-toastify"
import adminsAtom from "../../store/adminsAtom"
import { confrimationDialog } from "../../store/dialogAtom"

export type EditAdminErrorMessages ={
    email?:string,
    password?:string,
    [key: string]: string | undefined;
}
const EditAdminSheet = () => {
    const setAdmins = useSetRecoilState(adminsAtom)
    const [editAdminSheetState,setEditAdminSheetState] = useRecoilState(editAdminSheet)
    const onClose = () => setEditAdminSheetState({
        isOpen:false,
        id:'',
        values:{
            email:'',
            password:''
        }
    })
    
    const setValue = (newValues:Partial<AdminFormInput>) =>{
        setEditAdminSheetState((prev)=>({
            ...prev,
            values:{
                ...prev.values,
                ...newValues
            }
        }))
    }

    const [errors,setErrors] = useState<EditAdminErrorMessages>({})
    const setConfirmDialogue = useSetRecoilState(confrimationDialog)
    const [isLoading,setIsLoading] = useState(false)

    const editAdmin = async () => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/:${editAdminSheetState.id}`, editAdminSheetState.values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAdmins((prev)=>prev.map((admin)=>admin.id===response.data.data.id ? {
                    ...admin,
                    email:response.data.data.email,
                }:admin))
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
    
    const deleteAdmin = async () => {
        try {
            setIsLoading(true); // Set loading to true  
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/:${editAdminSheetState.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAdmins((prev)=>prev.filter((admin)=>admin.id !==response.data.data._id))
                onClose()
                toast.success(response?.data.message);
            } else {
              toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
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
        <Sheet open={editAdminSheetState.isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Admin
                    </SheetTitle>
                    <SheetDescription>
                        Create a new admin to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AdminForm
                    id={editAdminSheetState.id}
                    values={editAdminSheetState.values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{
                        setConfirmDialogue((prev)=>({
                            ...prev,
                            primaryAction:deleteAdmin,
                            isOpen:true,
                            title:"Are you sure?",
                            message:"Delete this admin"
                        }))
                    }}
                    onSubmit={editAdmin}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default EditAdminSheet