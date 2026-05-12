import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/discussion"; // your discussion API
const USER_API = "http://localhost:8000/user";      // user info API

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isAnonymousPost, setIsAnonymousPost] = useState(false);
  const [userName, setUserName] = useState("");

  const userId = localStorage.getItem("user_id"); // user_id from login

  // Fetch user name from backend
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await axios.get(`${USER_API}/${userId}`);
        setUserName(res.data.name || "Unknown");
      } catch (err) {
        console.error("Error fetching username:", err);
        setUserName("Unknown");
      }
    };
    fetchUserName();
  }, [userId]);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create a new post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    const postData = {
      author_id: userId,
      author_name: isAnonymousPost ? "Anonymous" : userName,
      content: newPostContent,
    };

    try {
      await axios.post(`${API_URL}/post`, postData);
      setNewPostContent("");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // Add reply to a post
  const handleAddReply = async (postId, replyContent, isAnonymousReply, setReplyContent) => {
    if (!replyContent.trim()) return;

    const replyData = {
      author_id: userId,
      author_name: isAnonymousReply ? "Anonymous" : userName,
      content: replyContent,
    };

    try {
      await axios.post(`${API_URL}/reply/${postId}`, replyData);
      setReplyContent("");
      fetchPosts();
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
  {/* Posts List */}
  <div className="flex-1 overflow-y-auto mb-4">
    {posts.map((post) => (
      <div key={post.id} className="bg-white p-4 rounded-2xl shadow mb-4">
        <p className="font-semibold">{post.author_name}</p>
        <p className="text-gray-700">{post.content}</p>
        <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>

        {/* Replies */}
        <div className="ml-4 mt-3">
          {post.replies.map((reply) => (
            <div key={reply.reply_id} className="border-l-2 pl-2 mb-2">
              <p className="font-medium text-sm">{reply.author_name}</p>
              <p className="text-gray-700 text-sm">{reply.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(reply.timestamp).toLocaleString()}
              </p>
            </div>
          ))}

          {/* Reply Input */}
          <ReplyBox postId={post.id} handleAddReply={handleAddReply} />
        </div>
      </div>
    ))}
  </div>

  {/* Create Post Section */}
  
  {/* Create Post Section */}
<div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-2">
  {/* Input */}
  <textarea
    className="flex-1 p-2 border rounded-lg resize-none"
    rows={1}
    placeholder="What's on your mind?"
    value={newPostContent}
    onChange={(e) => setNewPostContent(e.target.value)}
  />

  {/* Anonymous Checkbox */}
  <label className="flex items-center space-x-1 text-sm">
    <input
      type="checkbox"
      checked={isAnonymousPost}
      onChange={() => setIsAnonymousPost(!isAnonymousPost)}
    />
    <span>Anonymous</span>
  </label>

  {/* Post Button */}
  <button
    onClick={handleCreatePost}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    Post
  </button>
</div>

</div>

  );
};

// Component for Reply Box
const ReplyBox = ({ postId, handleAddReply }) => {
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymousReply, setIsAnonymousReply] = useState(false);

  return (
    <div className="mt-2">
      <textarea
        className="w-full p-2 border rounded-lg mb-2 text-sm"
        rows="1"
        placeholder="Write a reply..."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={isAnonymousReply}
            onChange={() => setIsAnonymousReply(!isAnonymousReply)}
          />
          <span>Reply as Anonymous</span>
        </label>
        <button
          onClick={() => handleAddReply(postId, replyContent, isAnonymousReply, setReplyContent)}
          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default DiscussionBoard;
