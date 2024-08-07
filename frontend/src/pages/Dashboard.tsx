import { useRecoilValue } from "recoil"

import adminAtom from "../store/adminAtom"

const Dashboard = () => {
  const admin = useRecoilValue(adminAtom)
  return (
    <div>
      id:{admin.id}
    </div>
  )
}

export default Dashboard