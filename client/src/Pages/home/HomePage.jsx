import React, { useState, useEffect } from "react";
import { BookOpen, Heart, MessageCircle, Users, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // add this to your imports

const slides = [
  {
    title: "Feeling low?",
    description:
      "Chat with our AI chatbot anytime to share how you feel. It listens, supports, and guides you.",
    buttonText: "Talk to Sakha 🤝",
    image: "🫠",
    link: "/",
  },
  {
    title: "Need professional help?",
    description:
      "Schedule a session with a mental health specialist to discuss your concerns and get expert advice.",
    buttonText: "Book Appointment",
    image: "📅",
    link: "/appointment",
  },
  {
    title: "Relax & Recharge",
    description:
      "Access relaxing audios, videos, motivational stories, and books to uplift your mood and improve mental health.",
    buttonText: "Explore Resources 📚",
    image: "🎧",
    link: "/resources",
  },
  {
    title: "Share & Inspire",
    description:
      "Read inspiring stories from others or write your own story to motivate and bring happiness to someone else’s life.",
    buttonText: "Read / Write Story 📝",
    image: "📝",
    link: "/blogs",
  },
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Carousel Section */}
      
      {/* Slides Section */}
<section className="w-full relative min-h-[65vh] bg-gray-50 flex items-center justify-center overflow-hidden py-6">
  <AnimatePresence mode="wait">
    <motion.div
      key={current}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
        exit: { opacity: 0 },
      }}
      className="w-full max-w-6xl flex flex-col items-center justify-center bg-white rounded-xl shadow-lg px-8 py-4 relative"
    >
      {/* Left Icon Button */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#52a173] text-white p-2 rounded-full shadow-md hover:bg-[#469361] transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Icon Button */}
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#52a173] text-white p-2 rounded-full shadow-md hover:bg-[#469361] transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Emoji */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -200 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 200 },
        }}
        transition={{ duration: 1.2 }}
        className="text-8xl"
      >
        {slides[current].image}
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={{
          hidden: { opacity: 0, x: 200 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -200 },
        }}
        transition={{ duration: 1.2 }}
        className="text-3xl md:text-5xl font-bold text-[#52a173] text-center mt-2 mb-2"
      >
        {slides[current].title}
      </motion.h2>

      {/* Description */}
      <motion.p
        variants={{
          hidden: { opacity: 0, x: -200 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 200 },
        }}
        transition={{ duration: 1.2 }}
        className="text-gray-700 text-center text-lg md:text-xl max-w-3xl mt-1 mb-2"
      >
        {slides[current].description}
      </motion.p>

      {/* React Native Style Button */}
      <Link to={slides[current].link}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 50 },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-3 w-40 py-3 bg-[#52a173] text-white rounded-md shadow-md text-lg font-semibold tracking-wide"
        >
          {slides[current].buttonText}
        </motion.button>
      </Link>
    </motion.div>
  </AnimatePresence>
</section>

      {/* What We Provide Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 px-6 bg-gray-50 text-center"
      >
        <h2 className="text-3xl font-bold text-[#52a173] mb-8">
          What We Provide 🌟
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition">
            <MessageCircle className="text-[#52a173] mx-auto" size={36} />
            <h3 className="text-xl font-semibold mt-2">24/7 Chat Support</h3>
            <p className="text-gray-600 mt-1">
              Talk to Sakha anytime and get instant emotional support.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition">
            <BookOpen className="text-[#52a173] mx-auto" size={36} />
            <h3 className="text-xl font-semibold mt-2">Wellness Resources</h3>
            <p className="text-gray-600 mt-1">
              Access self-help guides, blogs, and articles for mental health.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition">
            <Heart className="text-[#52a173] mx-auto" size={36} />
            <h3 className="text-xl font-semibold mt-2">Care & Support</h3>
            <p className="text-gray-600 mt-1">
              A safe and stigma-free space to express yourself freely.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition">
            <Users className="text-[#52a173] mx-auto" size={36} />
            <h3 className="text-xl font-semibold mt-2">Community</h3>
            <p className="text-gray-600 mt-1">
              Connect with students who understand and support each other.
            </p>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 px-6 bg-white text-center"
      >
        <h2 className="text-3xl font-bold text-[#52a173] mb-4">About Us 💚</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Mano Sakha is an initiative to make mental health support accessible,
          stigma-free, and student-friendly. Our mission is to provide emotional
          guidance, helpful resources, and a compassionate community where
          students feel heard, valued, and supported.
        </p>
      </motion.section>
    </div>
  );
}