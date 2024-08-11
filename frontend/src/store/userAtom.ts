import { atom } from "recoil"

const userAtom = atom({
    key:'User',
    default:{
        id:'',
        email:'',
        role:''
    }
})

export default userAtom;
