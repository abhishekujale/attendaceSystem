import { useRecoilState, useSetRecoilState } from "recoil"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { newEventSheet } from "../../store/sheetAtom"
import { useState } from "react"
import EventForm, { EventFormInput } from "../forms/EventForm"
import axios from "axios"
import { toast } from "react-toastify"
import eventsAtom from "@/store/eventsAtom"

export type NewEventErrorMessages ={
    compony?:string,
    date?:string,
    round?:string;
    [key: string]: string | undefined;
}
const NewEventSheet = () => {
    const setEvents = useSetRecoilState(eventsAtom)
    const [isOpen,setIsOpen] = useRecoilState(newEventSheet)
    const onClose = () => setIsOpen(false)
    const [values,setValues] = useState({
        compony:'',
        date:new Date(Date.now()),
        round:'',
    })
    const setValue = (newValues:Partial<EventFormInput>) =>{
        setValues((values)=>({
            ...values,
            ...newValues
        }))
    }
    const [errors,setErrors] = useState<NewEventErrorMessages>({})
    const [isLoading,setIsLoading] = useState(false)
    const addEvent = async (data: any) => {
        try {
            setIsLoading(true); // Set loading to true
            setErrors({}); // Clear previous errors
            
            console.log('Compressed data:', data);
            //Instead of sending to the backend, just console.log the data for now

            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/event/`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setValues({
                    compony:'',
                    date:new Date(Date.now()),
                    round:'',
                })
                setEvents((prev)=>([...prev,response.data.data]))
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
                        New Event
                    </SheetTitle>
                    <SheetDescription>
                        Create a new event.
                    </SheetDescription>
                </SheetHeader>
                <EventForm
                    values={values}
                    setValues={setValue}
                    disabled={isLoading}
                    onDelete={()=>{}}
                    onSubmit={addEvent}
                    errors={errors}
                />
            </SheetContent>
        </Sheet>
  )
}

export default NewEventSheet