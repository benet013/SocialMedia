import { useState, useEffect, useRef } from "react";
import Card from "../components/card";
import api from "../api";

function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [nextUrl, setNextUrl] = useState("/api/posts/?user=dashboard");
    const loadingRef = useRef(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        getAllPostsExceptLoggedInUser();
    }, [])

    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                getAllPostsExceptLoggedInUser();
            }
        });

        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [nextUrl]);


    const getAllPostsExceptLoggedInUser = async () => {
        if (!nextUrl || loadingRef.current) return;

        loadingRef.current = true;

        try {
            const response = await api.get(nextUrl);

            setPosts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newPosts = response.data.results.filter(
                    p => !existingIds.has(p.id)
                );
                return [...prev, ...newPosts];
            });

            setNextUrl(response.data.next);
        } catch (err) {
            console.log(err);
        } finally {
            loadingRef.current = false;
        }
    };


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

    return (
        <>
            <div className="dashboard-posts">
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

                <div ref={bottomRef} style={{ height: 1 }} />
            </div>
        </>
    )
}

export default Dashboard;