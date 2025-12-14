import Card from "../components/card";
import api from "../api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


function HomePage({ newPostCreated, setNewPostCreated }) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState(null);
    const [imageUrl, setImageUrl] = useState(null)
    const { id } = useParams();

    useEffect(() => {
        getUser();
        getPosts();
    }, [id]);

    useEffect(() => {
        if (newPostCreated) {
            getPosts();
            setNewPostCreated(false);
        }
    }, [newPostCreated]);

    const getPosts = async () => {
        const route = id ? `/api/posts/?user=${id}` : `/api/posts/`;
        try {
            const response = await api.get(route);
            setPosts(response.data);
            console.log("Posts fetched:", response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    const getUser = async () => {
        const route = id ? `/user/profile/${id}` : "/user/profile/self/";
        try {
            const response = await api.get(route);
            setUser(response.data.username);
            setBio(response.data.profile.bio)
            setImageUrl(response.data.profile.image_url)
            console.log("User data:", response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return (
        <>
            <main className="main-container">
                <section className="profile-header">
                    <h1 className="username">{user}</h1>

                    <div className="profile-info">

                        <img src={imageUrl} alt="Profile Picture"
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

                            {id ?
                                <button className="message-profile-btn">Message</button>
                                : <button className="edit-profile-btn">Edit Profile</button>
                            }
                        </div>

                    </div>


                    <p className="profile-bio">
                        {bio? bio : "This is my bio! I love coding and building awesome web applications."}
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
        </>
    );
}

export default HomePage;