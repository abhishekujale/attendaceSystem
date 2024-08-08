import { atom } from "recoil"

export type Event ={
    id:string,
    compony:string,
    date:Date,
    round:string
}

const eventsAtom = atom<Event[]>({
    key:'Events',
    default: [
        {
          id: "1",
          compony: "Tech Corp",
          date: new Date("2023-09-15"),
          round: "Interview"
        },
        {
          id: "2",
          compony: "Innovate Ltd",
          date: new Date("2023-10-01"),
          round: "Aptitude Test"
        },
        {
          id: "3",
          compony: "FutureWorks",
          date: new Date("2023-11-05"),
          round: "Group Discussion"
        },
        {
          id: "4",
          compony: "NextGen Solutions",
          date: new Date("2023-12-10"),
          round: "Technical Interview"
        },
        {
          id: "5",
          compony: "Startup Inc",
          date: new Date("2024-01-20"),
          round: "HR Interview"
        }
      ]
})

export default eventsAtom;
