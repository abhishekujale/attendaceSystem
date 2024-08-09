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
    const uploadChunks = async (eventId: number, fileData: any[]) => {
        const chunkSize = 50;
        for (let i = 0; i < fileData.length; i += chunkSize) {
            const chunk = fileData.slice(i, i + chunkSize);
            try {
                const token = localStorage.getItem("authToken");
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/event/upload-chunk/${eventId}`, 
                    { chunkData: chunk },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(`Chunk ${i / chunkSize + 1} uploaded successfully`);
            } catch (error) {
                console.error('Error uploading chunk:', error);
                // Handle error (maybe retry or notify user)
            }
        }
    };

    const addEvent = async (fileData: any[]) => {
        try {
            setIsLoading(true);
            setErrors({});

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
                const newEventId = response.data.data.id;
                setEvents((prev) => ([...prev, response.data.data]));
                await uploadChunks(newEventId, fileData);  // Upload chunks after event creation
                onClose();
                toast.success(response?.data.message);
            } else {
                toast.error(response?.data.message);
            }
        } catch (err: any) {
            // ... (error handling remains the same)
        } finally {
            setIsLoading(false);
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