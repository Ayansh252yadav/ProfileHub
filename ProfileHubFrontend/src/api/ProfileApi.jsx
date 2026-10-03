import api from "./Axiosconfiguration";

export const getMyProfile = async () => {
    const response = await api.get("/api/profile/me");
    return response.data;
};

export const updateBio = async (bio) => {
    const response = await api.post("/api/profile/bio", bio);
    return response.data;
};

export const addSkill = async (skill) => {
    const response = await api.post("/api/profile/skills", skill);
    return response.data;
};

export const addEducation = async (education) => {
    const response = await api.post("/api/profile/education", education);
    return response.data;
};

export const addWorkExperience = async (experience) => {
    const response = await api.post("/api/profile/work-experience", experience);
    return response.data;
};

export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        "/api/profile/profile-pic",
        formData
    );

    return response.data;
};

export const deleteEducation = async (id) => {
    const response = await api.delete(
        `/api/profile/education/${id}`
    );

    return response.data;
};

export const deleteWorkExperience = async (id) => {
    const response = await api.delete(
        `/api/profile/work-experience/${id}`
    );

    return response.data;
};

export const removeSkill = async (skill) => {
    const response = await api.delete(
        "/api/profile/skills",
        {
            data: {
                skill: skill
            }
        }
    );

    return response.data;
};

export const createPost = async (post) => {
    const formData = new FormData();

    formData.append("title", post.title);
    formData.append("body", post.body);

    if (post.media) {
        formData.append("media", post.media);
    }

    const response = await api.post(
        "/createPost",
        formData
    );

    return response.data;
};

export const deletePost = async (id) => {
    await api.delete(`/${id}`);
};

export const myPost = async () => {
    const response = await api.get("/myPosts");

    return response.data;
};

export const createComment = async (id, commentRequest) => {
    const response = await api.post(
        `/comment/create/${id}`,
        commentRequest
    );

    return response.data;
};

export const getComment = async (id) => {
    const response = await api.get(
        `/comment/${id}`
    );

    return response.data;
};

export const deleteComment = async (id) => {
    const response = await api.delete(
        `/comment/${id}`
    );

    return response.data;
};

export const likeCount = async (postId) => {
    const response = await api.post(
        `/api/likes/${postId}`
    );

    return response.data;
};

export const getLikeCount = async (postId) => {
    const response = await api.get(
        `/api/likes/getCount/${postId}`
    );

    return response.data;
};

export const getFeed = async () => {
    const response = await api.get(
        "/api/allFeed"
    );

    return response.data;
};

export const getUserProfile = async (userId) => {
    
    const response = await api.get(
        `/api/profile/${userId}`
    );

    

    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await api.get(
        `/post/${userId}`
    );

    return response.data;
};

// ==================== CONNECTION ====================

export const requestConnection = async (userId) => {
    const response = await api.post(
        `/connection/request/${userId}`
    );

    return response.data;
};

export const getPendingRequests = async () => {
    const response = await api.get(
        "/connection/pendingRequest"
    );

    return response.data;
};

export const updateConnectionStatus = async (status, requestId) => {
    const response = await api.put(
        `/connection/approved/${status}/${requestId}`
    );

    return response.data;
};

export const getConnections = async () => {
    const response = await api.get(
        "/connection"
    );

    return response.data;
};

export const getConnectionCount = async () => {
    const response = await api.get(
        "/connection/count"
    );

    return response.data;
};
export const searchUsers = async (name) => {
    const response = await api.get("/api/profile/search", {
        params: { name }
    });

    return response.data;
};