import { atom } from "recoil"
import { Admin } from "../components/tables/admins/columns";

const adminsAtom = atom<Admin[]>({
    key:'Admins',
    default:[]
})

export default adminsAtom;
