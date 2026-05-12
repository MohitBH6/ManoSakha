import React from "react";
import { BookOpen, Video, Headphones, Phone } from "lucide-react";

export default function Resources() {
  const resources = [
    {
      id: 1,
      title: "Self-Help Articles",
      description: "Read expert-written guides on stress, anxiety, and mental wellness.",
      icon: <BookOpen className="text-blue-600" size={40} />,
      link: "/login",
    },
    {
      id: 2,
      title: "Videos & Talks",
      description: "Watch motivational talks and guided meditations to uplift your mood.",
      icon: <Video className="text-green-600" size={40} />,
      link: "/login",
    },
    {
      id: 3,
      title: "Meditation Audios",
      description: "Listen to calming audio tracks and mindfulness exercises anytime.",
      icon: <Headphones className="text-purple-600" size={40} />,
      link: "/login",
    },
    {
      id: 4,
      title: "Helplines",
      description: "Access important emergency contacts and mental health helplines.",
      icon: <Phone className="text-red-600" size={40} />,
      link: "/helplines",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6 text-center">
        📚 Resources Library
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Explore helpful tools, guides, and activities to support your mental well-being.
      </p>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition"
          >
            <div className="flex justify-center mb-4">{res.icon}</div>
            <h3 className="font-semibold text-lg">{res.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{res.description}</p>
            <a
              href={res.link}
              className="text-blue-600 font-medium hover:underline"
            >
              Explore →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
