const API_URL = 'http://localhost:5000/api';

export const api = {
    // Login / Create User
    login: (username: string) => 
        fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
    }).then(res => res.json()),

    // Posts
    getPosts: () => fetch(`${API_URL}/posts`).then(res => res.json()),
  
    createPost: (post: { title: string; content: string; username: string }) =>
        fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
    }).then(res => res.json()),

    updatePost: (id: number, post: { title: string; content: string; username: string }) =>
        fetch(`${API_URL}/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
    }).then(res => res.json()),

    deletePost: (id: number, username: string) =>
        fetch(`${API_URL}/posts/${id}?username=${username}`, { method: "DELETE" }),

    // Comments
    getComments: (postId: number) => 
        fetch(`${API_URL}/posts/${postId}/comments`).then(res => res.json()),

    createComment: (comment: { post_id: number; username: string; body: string }) =>
        fetch(`${API_URL}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment),
    }).then(res => res.json()),

    updateComment: (id: number, comment: { username: string; body: string }) =>
        fetch(`${API_URL}/comments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment),
    }).then(res => res.json()),

    deleteComment: (id: number, username: string) =>
        fetch(`${API_URL}/comments/${id}?username=${username}`, { method: "DELETE" }),

};