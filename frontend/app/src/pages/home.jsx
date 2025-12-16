import Card from "../components/card";
import api from "../api";
import { useState, useEffect } from "react";
import { useAsyncError, useParams } from "react-router-dom";
import EditForm from "../components/editForm";


function HomePage({ newPostCreated, setNewPostCreated }) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState(null);
    const [imageUrl, setImageUrl] = useState(null)
    const [follower, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)
    const [isFollowing, setIsFollowing] = useState(false);

    const [data, setData] = useState(null)
    const { id } = useParams();
    const [edit, setEdit] = useState(false);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        getUser();
        getPosts();
    }, [id]);

    useEffect(() => {
        if (newPostCreated) {
            getPosts();
            setNewPostCreated(false);
        }
        if (updated) {
            getUser();
            setUpdated(false);
        }
    }, [updated, newPostCreated]);

    const likedOrDisliked = async (id) => {
        try {
            setPosts((posts) =>
                posts.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            likes: p.liked ? p.likes - 1 : p.likes + 1,
                            liked: !p.liked,
                        }
                        : p
                ))
            await api.patch(`/api/posts/${id}/like/`)

        } catch (err) {
            console.log(err)
        }
    }

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
        const route = id ? `/user/profile/${id}/` : "/user/profile/self/";
        try {
            const response = await api.get(route);
            setUser(response.data.username);
            setBio(response.data.profile.bio)
            setImageUrl(response.data.profile.image_url)
            setFollowers(response.data.profile.followers_count)
            setFollowing(response.data.profile.following_count)
            setIsFollowing(response.data.profile.is_following)
            setData(response.data)
            console.log("User data:", response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    const followOrUnfollow = async (id) => {
        try {
            const response = await api.patch(`/user/profile/${id}/follow/`)
            console.log(response.data)
            setFollowers(response.data.followers_count);
            setIsFollowing(response.data.is_following);
        } catch (err) {
            console.log(err)
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
                                    <span className="stat-number">{follower}</span>
                                </div>
                                <div className="stat-column">
                                    <span className="stat-label">Following</span>
                                    <span className="stat-number">{following}</span>
                                </div>
                            </div>

                            {id ?
                                <button className="message-profile-btn" onClick={() => followOrUnfollow(id)}>{isFollowing ? "Unfollow" : "Follow"}</button>
                                : <button className="edit-profile-btn" onClick={() => setEdit(true)}>Edit Profile</button>
                            }
                        </div>

                    </div>


                    <p className="profile-bio">
                        {bio ? bio : "This is my bio! I love coding and building awesome web applications."}
                    </p>
                </section>

                <section className="posts-section">
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                username={`@${post.author_name}`}
                                content={post.content}
                                likes={post.likes}
                                liked={post.liked}
                                likedOrDisliked={() => { likedOrDisliked(post.id) }}
                                date={new Date(post.created_at).toLocaleDateString()}
                            />
                        ))}
                    </div>
                </section>
                {edit && (
                    <div className="modal-overlay" onMouseDown={() => setEdit(false)}>
                        <div
                            className="modal-content"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <EditForm
                                data={data}
                                popUp={() => setEdit(false)}
                                setUpdated={() => setUpdated(true)}
                            />
                        </div>
                    </div>
                )}

            </main>

        </>
    );
}

export default HomePage;