function UserProfile({username, email, onClick}) {
    return (
        <div className="user-result-card" onClick={onClick}>
            <img
                src="https://placehold.co/60x60"
                alt="User Avatar"
                className="user-avatar"
            />

            <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-username">{email}</span>
            </div>
        </div>
    );
}

export default UserProfile;