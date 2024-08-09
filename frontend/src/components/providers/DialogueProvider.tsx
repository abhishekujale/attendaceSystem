import { ConfirmDialogue } from "../dialogs/ConfirmDialog"
import { QrDialogue } from "../dialogs/QRdialog"

const DialogueProvider = () => {
  return (
    <>
      <ConfirmDialogue />
      <QrDialogue />
    </>
  )
}

export default DialogueProvider