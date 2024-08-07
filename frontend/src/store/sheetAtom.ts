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
        }
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
