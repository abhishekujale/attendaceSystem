import { atom, selector } from "recoil";

interface EditAdminSheetState {
    isOpen:boolean,
    id:string,
    values:{
        email:string,
        password:string
    }
}

interface SheetsState {
    NewAdminSheet: boolean;
    EditAdminSheet : EditAdminSheetState;
    NewEventSheet:boolean;
}

const sheetAtom = atom<SheetsState>({
    key: 'Sheets',
    default: {
        NewAdminSheet: false,
        EditAdminSheet :{
            isOpen:false,
            id:'',
            values:{
                email:'',
                password:'',
                
            }
        },
        NewEventSheet:false,
    },
});

export const newAdminSheet = selector<boolean>({
    key: 'NewAdminSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.NewAdminSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            NewAdminSheet: newValue as boolean,
        });
    },
});

export const editAdminSheet = selector<EditAdminSheetState>({
    key: 'EditAdminSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.EditAdminSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            EditAdminSheet: newValue as EditAdminSheetState,
        });
    },
});

export const newEventSheet = selector<boolean>({
    key: 'NewEventSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.NewEventSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            NewEventSheet: newValue as boolean,
        });
    },
});
