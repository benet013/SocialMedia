import { useState } from "react";
import api from "../api";

function CreatePost({popUp, newPost}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const createPost = async () => {
        const payload = {
            title: title,
            content: content
        };
        try {
            const response = await api.post('/api/posts/', payload)
            console.log("Post created:", response.data);
            newPost();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost();
        setTitle("");
        setContent("");
    }


    return (
        <>
            <link
                rel="stylesheet"
                href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
            />

            <div className="create-form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <h2>Create a New Post</h2>
                        <header>
                            <i
                                className="uil uil-times"
                                style={{ cursor: "pointer" }}
                                onClick={popUp}
                            />
                        </header>
                    </div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button type="submit">Post</button>
                </form>

            </div>
        </>
    );
}

export default CreatePost;