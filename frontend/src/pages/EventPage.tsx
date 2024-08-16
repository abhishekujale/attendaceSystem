import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/tables/students/columns';
import * as XLSX from 'xlsx';

// Define the types for the event and student data
export interface StudentRaw {
    id: number;
    eventId: number;
    emailId: string;
    prn: string;
    name: string;
    branch: string;
    present: boolean;
}

interface Event {
    id: number;
    compony: string;
    date: string;
    round: string;
    students: StudentRaw[];
}

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("authToken"); 
        if (!token) {
            toast.error("No authentication token found");
            return;
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvent(response.data.data);
      } catch (error: any) {
        console.log(error)
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleDownloadExcel = () => {
    if (event && event.students && event.students.length > 0) {
      // Filter and map the student data to include only the required fields
      const filteredStudents = event.students.map(student => ({
        name: student.name,
        branch: student.branch,
        prn: student.prn,
        emailId: student.emailId
      }));
  
      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(filteredStudents);
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Students");
  
      // Generate a buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
      // Create a Blob from the buffer
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${event.compony}_${event.round}_students.xlsx`;
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
    } else {
      toast.error("No student data available to download");
    }
  };

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
          <div className='flex flex-col gap-2'>
            <CardTitle className="text-2xl line-clamp-1">
              {event?.compony}
            </CardTitle>
            <CardDescription>
              {event?.round}
            </CardDescription>
          </div>
          
          <Button 
            className="sm"
            onClick={handleDownloadExcel}
          >
            <Download className="size-4 mr-2"/> 
            Download excel
          </Button>
        </CardHeader>
        <CardContent>
          <div>
            <DataTable 
              filterKey={['prn','emailId' , 'name']} 
              columns={columns} 
              data={event?.students || []} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export default EventPage;