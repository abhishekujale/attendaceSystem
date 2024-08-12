import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { toast } from 'react-toastify';
import { MdQrCodeScanner } from "react-icons/md";


const UserDashboard = () => {
  const [scannedData, setScannedData] = useState<{
    id: string;
    compony: string;
  } | null>(null);

  const [showScanner, setShowScanner] = useState(false);

  const handleScan = async (data: { text: string } | null) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data.text);
        setScannedData({
          id: parsedData.id,
          compony: parsedData.compony,
        });
        console.log(parsedData);
        setShowScanner(false);

        // Make the API call to mark attendance
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No authentication token found");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/mark-attendance/${parsedData.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }

      } catch (error:any) {
        console.error('Error processing QR code:', error);
        toast.error( error.response.data.message ||'Error processing QR code');
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setShowScanner(false);
    toast.error('Error scanning QR code');
  };

  return (
    <div className='flex justify-center w-full '>
      <div className='flex justify-center items-center w-screen sm:w-96 h-96 sm:h-64  rounded-3xl bg-white text-blue-600 text-9xl -mt-28  border-blue-600 border-4 '>
      <button onClick={() => setShowScanner(true)}><MdQrCodeScanner className='static' /></button>
      </div>
      <Dialog open={showScanner} onOpenChange={()=>setShowScanner(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Scan QR
            </DialogTitle>
            <DialogDescription>
              Scan your QR code
            </DialogDescription>
          </DialogHeader>
          
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
