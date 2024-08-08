import EditAdminSheet from "../sheets/EditAdminSheet"
import NewAdminSheet from "../sheets/NewAdminSheet"
import NewEventSheet from "../sheets/NewEventSheet"

const SheetProvider = () => {
  return (
    <div>
        <NewAdminSheet />
        <EditAdminSheet />
        <NewEventSheet />
    </div>
  )
}

export default SheetProvider