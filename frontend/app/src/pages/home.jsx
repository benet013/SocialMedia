import NavBar from "../components/navbar";
import Card from "../components/card";
import CreatePost from "../components/createPost";
import api from "../api";
import { useState, useEffect } from "react";


function HomePage() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [newPostCreated, setNewPostCreated] = useState(false);

    useEffect(() => {
        getUser();
        getPosts();
    }, []);

    useEffect(() => {
        if (newPostCreated) {
            getPosts();
            setNewPostCreated(false);
        }
    }, [newPostCreated]);

    const getPosts = async () => {
        try {
            const response = await api.get('/api/posts/');
            setPosts(response.data);
            console.log("Posts fetched:", response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    const getUser = async () => {
        try {
            const response = await api.get('/user/profile/');
            setUser(response.data.username);
            console.log("User data:", response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return (
        <>
            <NavBar popUp={() => setPopUp(true)} />
            <main className="main-container">
                <section className="profile-header">
                    <h1 className="username">{user}</h1>

                    <div className="profile-info">

                        <img src="https://placehold.co/120x120/cccccc/969696?text=Avatar" alt="Profile Picture"
                            className="profile-pic" />

                        <div className="profile-right">
                            <div className="profile-stats">
                                <div className="stat-column">
                                    <span className="stat-label">Followers</span>
                                    <span className="stat-number">2</span>
                                </div>
                                <div className="stat-column">
                                    <span className="stat-label">Following</span>
                                    <span className="stat-number">2</span>
                                </div>
                            </div>

                            <button className="edit-profile-btn">Edit Profile</button>
                        </div>

                    </div>


                    <p className="profile-bio">
                        This is my bio! I love coding and building awesome web applications.
                    </p>
                </section>

                <section className="posts-section">
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                username={post.author_username}
                                content={post.content}
                                likes={post.likes}
                                date={new Date(post.created_at).toLocaleDateString()}
                            />
                        ))}
                    </div>
                </section>
            </main>


            {popUp && (
                <div className="modal-overlay" onMouseDown={() => setPopUp(false)}>
                    <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
                        <CreatePost popUp={() => setPopUp(false)} newPost={() => setNewPostCreated(true)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default HomePage;