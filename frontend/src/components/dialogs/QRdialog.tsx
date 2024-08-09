import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useRecoilState } from "recoil";
import { qrDialog } from "@/store/dialogAtom";
import { useEffect, useState } from "react";
import QRCode from 'qrcode';
import { Event } from "@/store/eventsAtom";
import jsPDF from 'jspdf';

export const QrDialogue = () => {
    const [qr, setQr] = useRecoilState(qrDialog);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const generateQRCode = async (data: Event) => {
        const jsonData = JSON.stringify(data);

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(jsonData);
            setQrCodeUrl(qrCodeDataUrl);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    useEffect(() => {
        generateQRCode(qr.jsonData);
    }, []);

    const downloadPDF = () => {
        if (!qrCodeUrl) return;

        const pdf = new jsPDF();
        pdf.addImage(qrCodeUrl, 'PNG', 10, 10, 180, 180);
        pdf.save(`${qr.jsonData.compony}.pdf`);
    };

    return (
        <Dialog open={qr.isOpen} onOpenChange={() =>
            setQr((prev) => ({
                ...prev,
                isOpen: false,
                jsonData: {
                    id: '',
                    compony: '',
                    date: new Date(),
                    round: ''
                }
            }))
        }>
            <DialogContent className="w-80">
                <DialogHeader>
                    <DialogTitle>Scan QR code</DialogTitle>
                    <DialogDescription>Scan your QR code</DialogDescription>
                </DialogHeader>

                {qrCodeUrl && (
                    <div className="">
                        <div className="">
                            <div className="flex justify-center mb-4">
                                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() =>
                        setQr((prev) => ({
                            ...prev,
                            isOpen: false,
                            jsonData: {
                                id: '',
                                compony: '',
                                date: new Date(),
                                round: ''
                            }
                        }))
                    }>
                        Cancel
                    </Button>
                    <Button onClick={downloadPDF}>
                        Download QR Code
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
