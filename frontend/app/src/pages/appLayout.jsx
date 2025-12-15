import NavBar from "../components/navbar";
import { useLocation } from "react-router-dom";

function AppLayout({ popUp }) {
    const location = useLocation();

    const hideNav =
        location.pathname === "/login" ||
        location.pathname === "/register";

    return !hideNav ? <NavBar popUp={popUp} /> : null;
}

export default AppLayout;