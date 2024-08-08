import { User } from "@/components/tables/users/colomns";
import { atom } from "recoil";

const usersAtom = atom<User[]>({
    key: 'Users',
    default: []
});

export default usersAtom;
