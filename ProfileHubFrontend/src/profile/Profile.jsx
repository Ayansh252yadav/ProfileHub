import { useEffect, useState } from "react";
import { getMyProfile, myPost } from "../api/ProfileApi";

import ProfileHeader from "./ProfileHeader";
import Skills from "./Skills";
import Education from "./Education";
import Experience from "./Experience";
import Navbar from "../LandingPages/Navbar";
import Post from "./Post";

const Profile = () => {

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {

        try {

            const profileData = await getMyProfile();
            const postsData = await myPost();

            setProfile(profileData);
            setPosts(postsData);

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Unable to load profile.
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="py-8">

                <ProfileHeader
                    profile={profile}
                    onProfileUpdated={fetchProfile}
                />

                <Skills
                    profile={profile}
                    onProfileUpdated={fetchProfile}
                />

                <Education
                    profile={profile}
                    onProfileUpdated={fetchProfile}
                />

                <Experience
                    profile={profile}
                    onProfileUpdated={fetchProfile}
                />

                <Post
                    posts={posts}
                    onProfileUpdated={fetchProfile}
                />

            </div>
        </div>
    );
};

export default Profile;