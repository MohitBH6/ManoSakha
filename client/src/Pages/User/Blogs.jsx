import React from "react";

const blogs = [
  {
    id: 1,
    title: "Dealing with Exam Stress",
    description:
      "Simple strategies to manage stress, stay calm, and boost your performance during exams.",
    image: "https://source.unsplash.com/400x250/?student,study",
    url: "/blog/1",
    external: false,
  },
  {
    id: 2,
    title: "The Power of Talking",
    description:
      "Why opening up about your feelings can help lighten your mind and improve your well-being.",
    image: "https://source.unsplash.com/400x250/?mentalhealth,conversation",
    url: "/blog/2",
    external: false,
  },
  {
    id: 3,
    title: "Small Habits, Big Change",
    description:
      "Learn how tiny daily habits can make a huge difference in your mental health journey.",
    image: "https://source.unsplash.com/400x250/?wellness,meditation",
    url: "/blog/3",
    external: false,
  },

  // ✅ Indian Mental Health & Wellness Resources
  {
    id: 4,
    title: "NIMHANS – Mental Health Awareness",
    description:
      "National Institute of Mental Health and Neurosciences (Bengaluru) resources on stress, anxiety, and mental health awareness.",
    image: "https://source.unsplash.com/400x250/?hospital,mentalhealth",
    url: "https://nimhans.ac.in/mental-health-awareness/",
    external: true,
  },
  {
    id: 5,
    title: "YourDOST – Online Counseling Platform",
    description:
      "An Indian startup offering online counseling and mental wellness blogs, with expert advice on stress, relationships, and career issues.",
    image: "https://source.unsplash.com/400x250/?counseling,india",
    url: "https://yourdost.com/blog/",
    external: true,
  },
  {
    id: 6,
    title: "Fortis Mental Health Program",
    description:
      "Fortis Hospitals’ mental health blog with insights from Indian psychologists and psychiatrists.",
    image: "https://source.unsplash.com/400x250/?doctor,healthcare",
    url: "https://www.fortishealthcare.com/blog/mental-health",
    external: true,
  },
  {
    id: 7,
    title: "Government of India – MANODARPAN",
    description:
      "Ministry of Education’s official initiative for mental health support to students, teachers, and families in India.",
    image: "https://source.unsplash.com/400x250/?india,students",
    url: "https://manodarpan.education.gov.in/",
    external: true,
  },
];

export default function Blogs() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-10">
        🌱 Our Blog – Read. Learn. Heal.
      </h2>

      {/* Blog Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{blog.description}</p>
              {blog.external ? (
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Visit Resource →
                </a>
              ) : (
                <a
                  href={blog.url}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read More →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
