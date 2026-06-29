import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "/logo.jpg";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }
    
    // Fetch user data here - temporary static name
    setTimeout(() => {
      setUserName("Student"); // Replace with actual user name from API
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleLogout = () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded shadow">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Mano Sakha Logo" className="h-12 w-12 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-gray-800">ManoSakha</h1>
            {userName && <p className="text-sm text-gray-600">Welcome, {userName}!</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/student/assesment")}
          >
            Assesment
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/discussion")}
          >
            Discussion
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/blogs")}
          >
            View Blogs
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => navigate("/student/resources")}
          >
            View Resources
          </button>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => navigate("/student/appointments")}
          >
            Book Appointment
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Hero Welcome Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 rounded-lg shadow">
        <h2 className="text-4xl font-bold mb-4">Welcome back, {userName}! 👋</h2>
        <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition cursor-pointer"
             onClick={() => navigate("/student/appointments")}>
          <div className="text-2xl font-bold text-blue-600">2</div>
          <div className="text-gray-600">Upcoming Meetings</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition cursor-pointer"
             onClick={() => navigate("/student/resources")}>
          <div className="text-2xl font-bold text-green-600">15</div>
          <div className="text-gray-600">Resources Available</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition cursor-pointer"
             onClick={() => navigate("/student/discussion")}>
          <div className="text-2xl font-bold text-purple-600">8</div>
          <div className="text-gray-600">Active Discussions</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition cursor-pointer"
             onClick={() => navigate("/blogs")}>
          <div className="text-2xl font-bold text-orange-600">12</div>
          <div className="text-gray-600">New Blogs</div>
        </div>
      </div>

      {/* Today's Focus Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mood & Wellness */}
        <div className="bg-gradient-to-br from-pink-100 via-white to-purple-100 p-6 rounded-lg shadow border-2 border-pink-200">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">How's your day going? 🌈</h3>
          <div className="flex justify-around mb-6">
            {['😢 Stressed', '😐 Okay', '😊 Good', '🤩 Great', '🎯 Focused'].map((mood, index) => (
              <button 
                key={index}
                className="flex flex-col items-center p-3 rounded-2xl hover:bg-white hover:shadow transition"
                onClick={() => alert(`Thanks for sharing! We'll adjust recommendations based on your mood.`)}
              >
                <span className="text-3xl mb-1">{mood.split(' ')[0]}</span>
                <span className="text-xs">{mood.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Inspiration */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">💫 Today's Mantra</h3>
          <blockquote className="text-lg italic mb-4">
            "Small daily improvements are the key to staggering long-term results."
          </blockquote>
          <div className="flex items-center justify-between">
            <span className="text-indigo-200">- Atomic Habits</span>
            <button className="bg-white text-indigo-600 px-3 py-1 rounded text-sm hover:bg-gray-100">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your September Progress 📊</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">Learning Days</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Skills Gained</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
            <div className="text-gray-600">Community Help</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Today's Challenges 🏆</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="border-2 border-dashed border-green-300 p-4 rounded-lg text-center hover:bg-green-50 cursor-pointer transition"
            onClick={() => navigate("/student/discussion")}
          >
            <div className="text-3xl mb-2">💬</div>
            <h4 className="font-semibold text-green-700">Start a Discussion</h4>
            <p className="text-sm text-gray-600">Share your thoughts on a topic</p>
            <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">+10 XP</div>
          </div>

          <div 
            className="border-2 border-dashed border-blue-300 p-4 rounded-lg text-center hover:bg-blue-50 cursor-pointer transition"
            onClick={() => navigate("/blogs")}
          >
            <div className="text-3xl mb-2">📖</div>
            <h4 className="font-semibold text-blue-700">Read a Blog</h4>
            <p className="text-sm text-gray-600">Learn something new today</p>
            <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">+15 XP</div>
          </div>

          <div 
            className="border-2 border-dashed border-purple-300 p-4 rounded-lg text-center hover:bg-purple-50 cursor-pointer transition"
            onClick={() => alert("Goal setting feature coming soon!")}
          >
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-purple-700">Set a Goal</h4>
            <p className="text-sm text-gray-600">Plan your learning journey</p>
            <div className="mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">+20 XP</div>
          </div>

          <div 
            className="border-2 border-dashed border-orange-300 p-4 rounded-lg text-center hover:bg-orange-50 cursor-pointer transition"
            onClick={() => navigate("/student/discussion")}
          >
            <div className="text-3xl mb-2">🤝</div>
            <h4 className="font-semibold text-orange-700">Help Someone</h4>
            <p className="text-sm text-gray-600">Answer a question in forum</p>
            <div className="mt-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">+25 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}