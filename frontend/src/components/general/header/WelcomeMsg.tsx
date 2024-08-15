import { useLocation } from 'react-router-dom';
const WelcomeMsg = () => {
    const location = useLocation();
    const path = location.pathname;

    let subtitle = "This is your Attendance Overview Report";

    if (path === "/events") {
        subtitle = "This is your Event's";
    } else if (path === "/admins") {
        subtitle = "This is your Admin's";
    }else if (path === "/userdashboard") {
        subtitle = "Scan the QR to mark your attendees.";
    }
    return (
    <div className="space-y-2 mb=4">
        <h2 className="text-2xl lg:text-4xl text-white font-medium ">
            Welcome back 
        </h2>
        <p className="text-sm lg:text-base text-[#89B6FD]">
            {subtitle}
        </p>
        
    </div>
  )
}

export default WelcomeMsg