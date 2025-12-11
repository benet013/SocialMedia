import NavBar from "../components/navbar";
import Card from "../components/card";


function HomePage() {
    return (
        <>
            <NavBar />
            <main className="main-container">
                <section className="profile-header">
                    <h1 className="username">@benet013</h1>

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
                        <Card username="@benet013" content="Hello world!" likes={5} date="30 Oct 2024" />
                        <Card username="@benet013" content="Just had a great day!" likes={3} date="29 Oct 2024" />
                        <Card username="@benet013" content="Loving this new app!" likes={8} date="28 Oct 2024" />  

                    </div>
                </section>
            </main>
        </>
    );
}

export default HomePage;