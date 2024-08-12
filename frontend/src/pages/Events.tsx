import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useRecoilState, useSetRecoilState } from "recoil"
import axios from "axios"
import { toast } from "react-toastify"
import { Skeleton } from "../components/ui/skeleton"
import disabledAtom from "../store/disabledAtom"
import eventsAtom from "@/store/eventsAtom"
import { newEventSheet } from "@/store/sheetAtom"
import EventCard from "@/components/cards/EventCard"

const Events = () => {
    const [events,setEvents] = useRecoilState(eventsAtom)
    const [loading,setLoading] = useState(false)
    const [disabled,setDisabled] = useRecoilState(disabledAtom)
    const setIsNewEventOpen = useSetRecoilState(newEventSheet)
    const OpenNewEventSheet = () => setIsNewEventOpen(true)
    
    const getEventData = async () =>{
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/event`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                
                setEvents(([...response.data.data ]));
            } else {
                console.log("Error getting events.")
            }
        } catch (err:any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }
    
    const handleEndEvent = async (eventId: string) => {
        try {
            setDisabled(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/event/${eventId}/end`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setEvents(prevEvents => prevEvents.map(event => 
                    event.id === eventId ? { ...event, status: 'ended' } : event
                ));
                toast.success("Event ended successfully");
            } else {
                toast.error("Error ending event");
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setDisabled(false);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            setDisabled(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/event/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
                toast.success("Event deleted successfully");
            } else {
                toast.error("Error deleting event");
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setDisabled(false);
        }
    };

    useEffect(()=>{
        getEventData()
    },[])

    if(loading) return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-slate-300"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-2xl line-clamp-1">
                       Your Events
                    </CardTitle>
                    <Button 
                        className="sm"
                        onClick={OpenNewEventSheet}
                    >
                        <Plus className="size-4 mr-2"/> 
                        Add new event
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 overflow-auto">
                       {events.map((event)=>(
                             <EventCard 
                                key={event.id}
                                event={event}
                                onDelete={handleDeleteEvent}
                                onEndEvent={handleEndEvent}
                            />
                       ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Events