import api from "../api";
import { useState } from "react";
import UserProfile from "./userProfile";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [userName, setUserName] = useState("");
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/user/profile/?search=${userName}`);
            setUserList(response.data);
            console.log(response.data)
        }
        catch (error) {
            console.error("Error during search:", error);
        }
    }

    return (
        <>
            <div className="search-page">
                <h1 className="search-title">Search Users</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Search users..."
                    />
                    <button onClick={handleSubmit}>Search</button>
                </div>
                {userList.map((user) => (
                    <UserProfile 
                        key={user.id} 
                        username={user.username} 
                        email={user.email} 
                        onClick={() => navigate(`/profile/${user.id}`)}
                    />
                ))}
            </div>
        </>

    );
}

export default SearchBar;