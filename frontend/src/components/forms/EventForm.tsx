import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewAdminErrorMessages } from "../sheets/NewAdminSheet";
import { Plus, Save, Trash } from "lucide-react";

export type AdminFormInput ={
  company:string,
  date:string,
  round:string
}

type AdminFormProps = {
  id?:string,
  values:
  {
    company:string,
    date:string,
    round:string
  },
  onSubmit:()=>void,
  onDelete:()=>void,
  disabled?:boolean,
  errors:NewAdminErrorMessages,
  setValues:(value:Partial<AdminFormInput>)=>void
}

const AdminForm = ({
  id,
  values,
  onDelete,
  onSubmit,
  disabled,
  errors,
  setValues
}:AdminFormProps) => {

  return (
    <div>
      <div className="mt-8 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            type="company" 
            placeholder="Company name" 
            value={values.company}
            onChange={(e)=>setValues({company:e.target.value})}
            disabled={disabled}
          />
          {errors.company && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.company}
            </p>
          </div>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            placeholder="Date" 
            value={values.date}
            onChange={(e)=>setValues({date:e.target.value})}
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
            type="round" 
            placeholder="Round name" 
            value={values.round}
            onChange={(e)=>setValues({round:e.target.value})}
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
            onClick={onSubmit}
            disabled={disabled}
          >
            {!id && <Plus className="mr-2"/>}
            {!!id && <Save className="mr-2"/>}
            {!id && 'Create Admin'}
            {!!id && 'Save Changes'}
          </Button>
          {!!id && <Button 
            variant={'outline'} 
            className="w-full"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash size={20} className="mr-2"/>
            Delete Event
          </Button>}  
        </div>
      </div>
    </div>
  )
}

export default AdminForm