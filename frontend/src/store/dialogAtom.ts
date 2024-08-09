import { atom, selector } from "recoil";
import { Event } from "./eventsAtom";

interface ConfrimationDialogState {
    isOpen:boolean,
    title:string,
    message:string
    primaryAction:()=>void
}
interface QRDialogState {
    isOpen:boolean,
    jsonData:Event,
}

interface DialogState {
    ConfrimationDialog:ConfrimationDialogState,
    QRDialog:QRDialogState
}

const dialogAtom = atom<DialogState>({
    key: 'Dialogs',
    default: {
        ConfrimationDialog: {
            isOpen:false,
            title:"",
            primaryAction:()=>{},
            message:""
        },
        QRDialog:{
            isOpen:false,
            jsonData:{
                id:'',
                compony:'',
                date:new Date(),
                round:''
            }
        }
    },
});

export const confrimationDialog = selector<ConfrimationDialogState>({
    key: 'ConfrimationDialog',
    get: ({ get }) => {
        const dialogs = get(dialogAtom);
        return dialogs.ConfrimationDialog;
    },
    set: ({ set, get }, newValue) => {
        const dialogs = get(dialogAtom);
        set(dialogAtom, {
            ...dialogs,
            ConfrimationDialog: newValue as ConfrimationDialogState,
        });
    },
});

export const qrDialog = selector<QRDialogState>({
    key: 'QRDialog',
    get: ({ get }) => {
        const dialogs = get(dialogAtom);
        return dialogs.QRDialog;
    },
    set: ({ set, get }, newValue) => {
        const dialogs = get(dialogAtom);
        set(dialogAtom, {
            ...dialogs,
            QRDialog: newValue as QRDialogState,
        });
    },
});
