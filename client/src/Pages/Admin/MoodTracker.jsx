import React, { useState } from "react";
import { Smile, Frown, Meh, Heart } from "lucide-react";

export default function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [selected, setSelected] = useState(null);

  const moodOptions = [
    { id: 1, label: "Happy", icon: <Smile className="text-yellow-500" size={40} /> },
    { id: 2, label: "Sad", icon: <Frown className="text-blue-500" size={40} /> },
    { id: 3, label: "Neutral", icon: <Meh className="text-gray-500" size={40} /> },
    { id: 4, label: "Loved", icon: <Heart className="text-pink-500" size={40} /> },
  ];

  const saveMood = (mood) => {
    const entry = {
      mood,
      date: new Date().toLocaleString(),
    };
    setMoods([entry, ...moods]);
    setSelected(mood.label);
    setTimeout(() => setSelected(null), 2000);
  };

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
        🌈 Mood Tracker
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Record your feelings daily and reflect on your emotional journey.
      </p>

      {/* Mood Selection */}
      <div className="flex justify-center gap-8 mb-8">
        {moodOptions.map((m) => (
          <button
            key={m.id}
            onClick={() => saveMood(m)}
            className="flex flex-col items-center hover:scale-110 transition"
          >
            {m.icon}
            <span className="mt-2 font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Success Message */}
      {selected && (
        <p className="text-green-600 text-center mb-6">
          ✅ Your mood "{selected}" has been recorded!
        </p>
      )}

      {/* Mood History */}
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Mood History</h3>
        {moods.length === 0 ? (
          <p className="text-gray-500 text-sm">No moods recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {moods.map((entry, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{entry.mood.label}</span>
                <span className="text-sm text-gray-500">{entry.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
