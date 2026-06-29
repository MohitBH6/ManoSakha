import React, { useState } from "react";
import { assessments } from "./AssesmentData";

export default function Assesment() {
  const userId = localStorage.getItem("user_id") || "student_001";
  const [allAnswers, setAllAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);

  const handleAnswer = (assessmentId, qId, score) => {
    setAllAnswers((prev) => ({
      ...prev,
      [assessmentId]: {
        ...prev[assessmentId],
        [qId]: score,
      },
    }));
  };

  const handleSubmit = async () => {
    const assessmentResults = Object.entries(assessments).map(
      ([assessmentId, assessment]) => {
        const answers = allAnswers[assessmentId] || {};
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

        let severity = "Unknown";
        for (const [range, label] of Object.entries(assessment.scoring)) {
          const [low, high] = range.split("-").map(Number);
          if (totalScore >= low && totalScore <= high) {
            severity = label;
            break;
          }
        }

        return {
          user_id: userId,
          assessment_id: assessmentId,
          answers,
          total_score: totalScore,
          severity,
          date: new Date().toISOString(),
        };
      }
    );

    try {
      // Send results to backend
      const response = await fetch("http://localhost:8000/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions: assessmentResults }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      // Set results from local state (or fetch from backend if you prefer)
      setResults(assessmentResults);
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving assessments:", error);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Assessment Results 🎉</h2>
        {results.map((res) => (
          <div key={res.assessment_id} className="mb-6 p-6 border rounded-xl bg-gray-50 shadow">
            <h3 className="text-xl font-semibold mb-2">{assessments[res.assessment_id].name}</h3>
            <p>Score: <span className="font-bold">{res.total_score}</span></p>
            <p>Severity: <span className="font-bold text-blue-600">{res.severity}</span></p>
            <p className="text-gray-500 text-sm">Date: {new Date(res.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Assessments</h2>

      {Object.entries(assessments).map(([assessmentId, assessment]) => (
        <div key={assessmentId} className="mb-8 p-6 border rounded-2xl shadow-lg bg-white">
          <h3 className="text-2xl font-bold mb-4">{assessment.name}</h3>
          <p className="text-gray-600 mb-6">{assessment.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessment.questions.map((q) => (
              <div key={q.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium mb-2">{q.id}. {q.text}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(assessmentId, q.id, opt.score)}
                      className={`px-3 py-1 text-sm rounded-lg border ${
                        allAnswers[assessmentId]?.[q.id] === opt.score
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
      >
        Submit All Assessments
      </button>
    </div>
  );
}
