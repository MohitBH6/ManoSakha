import React, { useState } from "react";
import axios from "axios";
import { Calendar, Clock, FileText } from "lucide-react";

export default function StudentAppointments() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [concern, setConcern] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      setMessage("");

      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        setMessage("⚠️ Please login before booking an appointment.");
        setLoading(false);
        return;
      }

      // Validate form inputs
      if (!date || !time || !concern.trim()) {
        setMessage("⚠️ Please fill all fields before booking.");
        setLoading(false);
        return;
      }

      const payload = {
        user_id,
        date,
        time,
        concern,
      };

      console.log("Booking payload:", payload);

      const res = await axios.post("/api/appointments", payload);
      setMessage("✅ Appointment booked successfully!");
      console.log("Appointment booked:", res.data);

      // Reset form
      setDate("");
      setTime("");
      setConcern("");
    } catch (error) {
      console.error("Failed to book appointment", error);

      if (error.response?.status === 422) {
        setMessage("❌ Invalid data. Please check your inputs.");
      } else {
        setMessage("❌ Failed to book appointment. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-2xl">
      <h2 className="text-3xl md:text-4xl font-bold text-[#52a173] mb-8 text-center">
        Book Your Appointment
      </h2>

      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Date Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 items-center gap-2">
            <Calendar size={18} className="text-[#52a173]" /> Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52a173]"
          />
        </div>

        {/* Time Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 items-center gap-2">
            <Clock size={18} className="text-[#52a173]" /> Select Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52a173]"
          />
        </div>

        {/* Concern Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 items-center gap-2">
            <FileText size={18} className="text-[#52a173]" /> Your Concern
          </label>
          <textarea
            rows="4"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="Describe what you’d like to discuss..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52a173]"
          ></textarea>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookAppointment}
          disabled={loading}
          className="w-full px-6 py-3 bg-[#52a173] text-white rounded-lg font-semibold hover:bg-[#469361] transition shadow-md"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

        {/* Status Message */}
        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
