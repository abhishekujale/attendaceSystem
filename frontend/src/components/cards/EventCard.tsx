import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Event } from "@/store/eventsAtom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

type EventProps = {
    event: Event;
};

const EventCard = ({ event }: EventProps) => {
    const { id, compony, date, round } = event;

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));

    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

    const generateQRCode = async (data: Event) => {
        const jsonData = JSON.stringify(data);

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(jsonData);
            setQrCodeUrl(qrCodeDataUrl);
            setIsPopupVisible(true);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const handleGenerateClick = () => {
        generateQRCode(event);
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

            {/* Popup for QR Code */}
            {isPopupVisible && qrCodeUrl && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs mx-auto">
                    <div className="flex justify-center mb-4">
                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                    </div>
                    <div className="flex justify-center mb-4">
                        <a href={qrCodeUrl} download="qrcode.png">
                            <Button className="px-4 py-2 bg-gradient-to-r text-white rounded-md shadow-md transition-all duration-300">
                                Download QR Code
                            </Button>
                        </a>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            className="px-4 py-2 bg-gray-300 text-black rounded-md shadow-md"
                            onClick={() => setIsPopupVisible(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default EventCard;
