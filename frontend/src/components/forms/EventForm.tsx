import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewEventErrorMessages } from "../sheets/NewEventSheet";
import { Plus } from "lucide-react";
import * as XLSX from 'xlsx';
import pako from 'pako';

export type EventFormInput = {
  compony: string,
  date: Date,
  round: string
}

type EventFormProps = {
  id?: string,
  values: {
    compony: string,
    date: Date,
    round: string
  },
  onSubmit: (data: any) => void,
  onDelete: () => void,
  disabled?: boolean,
  errors: NewEventErrorMessages,
  setValues: (value: Partial<EventFormInput>) => void
}

const formatDate = (date: Date): string => {
  let d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const EventForm = ({
  id,
  values,
  onDelete,
  onSubmit,
  disabled,
  errors,
  setValues
}: EventFormProps) => {
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const binaryString = new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
  
      try {
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        const jsonString = JSON.stringify(jsonData);
  
        // Calculate size of original data
        const originalBlob = new Blob([jsonString], { type: 'application/json' });
        console.log('Original data size:', originalBlob.size, 'bytes');
  
        // Compress the JSON data
        const compressedData = pako.gzip(jsonString);
  
        // Calculate size of compressed data
        const compressedBlob = new Blob([compressedData]);
        console.log('Compressed data size:', compressedBlob.size, 'bytes');
  
        // Handle the compressed data as needed
        // onSubmit(compressedData);
      } catch (error) {
        console.error('Error processing file:', error);
        // toast.error("Error processing the file. Please ensure it's a valid .xlsx file.");
      }
    }
  };

  return (
    <div>
      <div className="mt-8 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="compony">Compony</Label>
          <Input 
            id="compony" 
            type="text" 
            placeholder="Compony name" 
            value={values.compony}
            onChange={(e) => setValues({ compony: e.target.value })}
            disabled={disabled}
          />
          {errors.compony && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.compony}
            </p>
          </div>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            placeholder="Date" 
            value={formatDate(values.date)}
            onChange={(e) => setValues({ date: new Date(e.target.value) })}
            disabled={disabled}
          />
          {errors.date && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.date}
            </p>
          </div>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="round">Round Name</Label>
          <Input 
            id="round" 
            type="text" 
            placeholder="Round name" 
            value={values.round}
            onChange={(e) => setValues({ round: e.target.value })}
            disabled={disabled}
          />
          {errors.round && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.round}
            </p>
          </div>}
        </div>
        <div className="grid gap-4 w-full">
          <Button 
            className="w-full"
            onClick={() => onSubmit(values)}
            disabled={disabled}
          >
            {!id && <Plus className="mr-2" />}
            {!id && 'Create Event'}
          </Button>
          
          <div className="grid gap-2">
            <Label htmlFor="file">Upload XLSX File</Label>
            <Input 
              id="file" 
              type="file" 
              accept=".xlsx" 
              onChange={handleFileUpload}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventForm;