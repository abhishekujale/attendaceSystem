import { atom } from "recoil"

export type Event ={
    id:string,
    compony:string,
    date:Date,
    round:string,
    status:string
}

const eventsAtom = atom<Event[]>({
    key:'Events',
    default: []
})

export default eventsAtom;
