import { atom } from "recoil"

const eventAtom = atom({
    key:'Admin',
    default:{
        id:'',
        company:'',
        date:'',
        round:''
    }
})

export default eventAtom;
