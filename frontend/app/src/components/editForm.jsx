import { useEffect, useState } from "react";
import api from "../api";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";

function EditForm({ data, popUp, setUpdated }) {
    const [username, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [removeImage, setRemoveImage] = useState(false)

    useEffect(() => {
        if (data) {
            setUserName(data.username)
            setEmail(data.email)
            setBio(data.profile.bio)
            setImagePreview(data.profile.image_url)
        }
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setRemoveImage(false);
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        if (image) form.append('image', image)
        if (removeImage) form.append('remove_image', 'true');
        if (username) form.append('username', username)
        if (email) form.append('email', email)
        if (bio) form.append('bio', bio)

        try {
            const response = await api.patch(
                "/user/profile/self/edit/",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data)
            setImagePreview(response.data.image)
            setImage(null)
            setRemoveImage(false)
        } catch (err) {
            console.log(err)
        }
        setUpdated();
        popUp();
    }


    return (
        <>
            <link
                rel="stylesheet"
                href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
            />

            <div className="edit-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h2>Edit Profile</h2>
                        <header>
                            <i
                                className="uil uil-times"
                                style={{ cursor: "pointer" }}
                                onClick={popUp}
                            />
                        </header>
                    </div>

                    <div className="profile-section">
                        <div className="profile-wrapper">
                            <div className="profile-img">
                                <img
                                    src={
                                        imagePreview ||
                                        "default.jpg"
                                    }
                                    alt="Profile"
                                />
                            </div>
                            {imagePreview ?
                                <label className="add-btn">
                                    <MdOutlineDeleteOutline size='22px' />
                                    <input
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                            setRemoveImage(true);
                                        }}
                                        style={{ display: "none" }}
                                    />
                                </label>
                                :
                                <label className="add-btn">
                                    <IoIosAdd size='22px' />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                </label>}
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <button type="submit">Update</button>
                </form>

            </div>
        </>
    );
}

export default EditForm;