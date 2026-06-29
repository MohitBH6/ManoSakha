import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Award, Flame } from "lucide-react";

export default function ResilienceBuilderPage() {
  const challenges = [
    {
      id: 1,
      title: "Gratitude Journaling ✨",
      prompt: "Write 3 things you’re grateful for this week.",
    },
    {
      id: 2,
      title: "Strengths Identification 💪",
      prompt: "What went well for you this week?",
    },
    {
      id: 3,
      title: "Positive Coping 🌿",
      prompt: "How did you cope with a challenge recently?",
    },
  ];

  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState("");
  const [streak, setStreak] = useState(3); // dummy streak
  const [badge, setBadge] = useState(false);

  const handleSubmit = () => {
    if (!response.trim()) return;
    setStreak(streak + 1);
    if (streak + 1 === 7) setBadge(true); // earn badge at 7 streaks
    alert("🌟 Great job reflecting! You’re building resilience 💪");
    setResponse("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#52a173] to-white flex flex-col items-center py-12 px-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-extrabold text-white mb-8"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Resilience Builder 🌱
      </motion.h1>

      {/* Streak + Badge */}
      <div className="flex gap-6 mb-10">
        <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-lg">
          <Flame className="text-orange-500" /> <span>Streak: {streak} days</span>
        </div>
        {badge && (
          <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-lg">
            <Award className="text-yellow-500" /> <span>Resilience Badge!</span>
          </div>
        )}
      </div>

      {/* Challenge Selector */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        {challenges.map((ch) => (
          <motion.button
            key={ch.id}
            className={`p-6 rounded-xl shadow-lg bg-white hover:scale-105 transition ${
              selected?.id === ch.id ? "border-2 border-[#52a173]" : ""
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(ch)}
          >
            <h2 className="text-xl font-bold text-[#52a173]">{ch.title}</h2>
          </motion.button>
        ))}
      </div>

      {/* Challenge Response */}
      {selected && (
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-[#52a173] mb-4">
            {selected.title}
          </h3>
          <p className="text-gray-600 mb-4">{selected.prompt}</p>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none"
          />

          <button
            onClick={handleSubmit}
            className="bg-[#52a173] text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
          >
            Submit
          </button>
        </motion.div>
      )}
    </div>
  );
}
