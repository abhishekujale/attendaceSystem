import { atom } from "recoil"

const adminAtom = atom({
    key:'User',
    default:{
        id:'',
        email:'',
        role:''
    }
})

export default adminAtom;
