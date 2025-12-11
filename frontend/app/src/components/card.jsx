import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

function Card({ username, content, likes, date }) {
    return (
        <div className="post-card">
            <div className="post-top-bar">
                <span className="post-username">{username}</span>
            </div>
            <div className="post-content">
                <span className="post-placeholder">{content}</span>
            </div>
            <div className="post-bottom-bar">
                <div className="post-like">
                    <span><FaRegHeart /></span>
                    <span className="like-count">{likes}</span>
                </div>
                <span className="post-date">{date}</span>
            </div>
        </div>
    );
}

export default Card;