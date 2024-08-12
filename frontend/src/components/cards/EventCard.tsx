import { Event } from "@/store/eventsAtom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useSetRecoilState } from 'recoil';
import { confrimationDialog, qrDialog } from '@/store/dialogAtom';
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

type EventProps = {
    event: Event;
    onDelete: (eventId: string) => Promise<void>;
    onEndEvent: (eventId: string) => Promise<void>;
};

const EventCard = ({ event, onDelete, onEndEvent }: EventProps) => {
    const navigate = useNavigate()
    const { id, compony, date, round, status } = event;
    const setQRDialogState = useSetRecoilState(qrDialog)
    const setConfirm = useSetRecoilState(confrimationDialog)
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirm({
            isOpen: true,
            message: 'Are you sure you want to delete this event?',
            title: 'Delete Event',
            primaryAction: () => {
                onDelete(event.id)
            }
        })
    };

    const handleEndEvent = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirm({
            isOpen: true,
            message: 'Are you sure you want to end this event?',
            title: 'End Event',
            primaryAction: () => {
                onEndEvent(event.id)
            }
        })
    };

    const handleGenerateClick = () => {
        setQRDialogState((prev) => ({
            ...prev,
            jsonData: { id: event.id, compony: event.compony },
            isOpen: true
        }));
    };

    return (
        <div className="mx-auto w-full cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/event/${id}`) }}>
            <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-200 relative rounded-2xl">
                <Trash
                    size={20}
                    className="absolute right-5 top-2 cursor-pointer"
                    onClick={handleDelete}
                />
                <p className="absolute right-5 top-10 text-sm text-[#444]">
                    {formattedDate}
                </p>
                
                <CardHeader className="gap-y-2 lgtext-sm text-[#444]:flex-row lg:items-start lg:justify-between">
                    <p className={`${status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                        {status === 'active' ? 'Active' : 'Ended'}
                    </p>
                    <CardTitle className="text-md line-clamp-1">
                        {compony}
                    </CardTitle>
                    <p className="">
                        {round}
                    </p>
                </CardHeader>
                <CardContent>
                <div className="text-sm text-[#444] flex flex-col gap-2 sm:justify-end sm:flex-row">
                    {status === 'active' && (
                        <Button
                            variant='outline'
                            className="px-4 py-2 bg-gradient-to-r text-black rounded-md shadow-md transition-all duration-300"
                            onClick={handleEndEvent}
                        >
                            End event
                        </Button>
                    )}
                    <Button
                        className="px-4 py-2 bg-gradient-to-r text-white rounded-md shadow-md transition-all duration-300"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleGenerateClick()
                        }}
                    >
                        Generate QR
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventCard;