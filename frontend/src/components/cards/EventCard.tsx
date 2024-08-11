
import { Event } from "@/store/eventsAtom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useSetRecoilState } from 'recoil';
import { qrDialog } from '@/store/dialogAtom';

type EventProps = {
    event: Event;
};

const EventCard = ({ event }: EventProps) => {
    const { id, compony, date, round } = event;
    const setQRDialogState = useSetRecoilState(qrDialog)
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));

    

    const handleGenerateClick = () => {
        setQRDialogState((prev) => ({
            ...prev,
            jsonData: { ...event },
            isOpen: true
        }));
    };

    return (
        <div className="mx-auto w-full">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md relative rounded-2xl">
                <p className="absolute right-5 top-5 text-sm text-[#444]">
                    {formattedDate}
                </p>
                <div className="absolute right-5 bottom-5 text-sm text-[#444]">
                    <Button
                        className="px-4 py-2 bg-gradient-to-r text-white rounded-md shadow-md transition-all duration-300"
                        onClick={handleGenerateClick}
                    >
                        Generate QR
                    </Button>
                </div>
                <CardHeader className="gap-y-2 lgtext-sm text-[#444]:flex-row lg:items-start lg:justify-between">
                    <CardTitle className="text-md line-clamp-1">
                        {compony}
                    </CardTitle>
                    <p className="">
                        {round}
                    </p>
                </CardHeader>
                <CardContent>
                    <div>
                        {/* Your content here */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventCard;
