import EditAdminSheet from "../sheets/EditAdminSheet"
import NewAdminSheet from "../sheets/NewAdminSheet"

const SheetProvider = () => {
  return (
    <div>
        <NewAdminSheet />
        <EditAdminSheet />
    </div>
  )
}

export default SheetProvider