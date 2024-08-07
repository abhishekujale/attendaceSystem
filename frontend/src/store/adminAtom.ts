import { atom } from "recoil"

const adminAtom = atom({
    key:'Admin',
    default:{
        id:'',
        email:'',
        role:''
    }
})

export default adminAtom;
