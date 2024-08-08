import { Event } from "@/store/eventsAtom"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

type EventProps = {
    event: Event
}

const EventCard = ({ event }: EventProps) => {
    const { id, compony, date, round } = event

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date))

    return (
        <div className="mx-auto w-full">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md relative rounded-2xl">
                <p className="absolute right-5 top-5 text-sm text-[#444]">
                    {formattedDate}
                </p>
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
                      
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default EventCard
