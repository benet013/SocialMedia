import { IoPersonOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function NavBar({popUp}) {
    const navigate = useNavigate();


    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <span className="app-name">BookFace</span>
                </div>
                <div className="nav-right">
                    <div className="nav-icon" onClick={() => navigate('/')}><IoPersonOutline size='20px' /></div>
                    <div className="nav-icon" onClick={popUp}><IoMdAddCircleOutline size='22px' /></div>
                    <div className="nav-icon" onClick={() => navigate('/dashboard')}><FaHouse size='20px' /></div>
                    <div className="nav-icon" onClick={() => navigate('/search')}><IoSearch size='20px' /></div>
                    <div className="nav-icon" onClick={() => navigate('/logout')}><IoLogOutOutline size='22px'/></div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;