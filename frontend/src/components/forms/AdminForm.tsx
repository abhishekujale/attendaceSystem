import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewAdminErrorMessages } from "../sheets/NewAdminSheet";
import { Plus, Save, Trash } from "lucide-react";

export type AdminFormInput ={
  email:string,
  password:string
}

type AdminFormProps = {
  id?:string,
  values:
  {
    email:string,
    password:string
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
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Name" 
            value={values.email}
            onChange={(e)=>setValues({email:e.target.value})}
            disabled={disabled}
          />
          {errors.email && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.email}
            </p>
          </div>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Password" 
            value={values.password}
            onChange={(e)=>setValues({password:e.target.value})}
            disabled={disabled}
          />
          {errors.password && <div className="ml-2">
            <p className="text-sm text-red-400">
              {errors.password}
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
            Delete Admin
          </Button>}  
        </div>
      </div>
    </div>
  )
}

export default AdminForm