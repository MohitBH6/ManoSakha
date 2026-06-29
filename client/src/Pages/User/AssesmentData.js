export const assessments = {
  // PHQ-9 (Depression)
  phq9: {
    name: "PHQ-9",
    description: "Depression severity assessment",
    questions: [
      { id: 1, text: "Little interest or pleasure in doing things?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 2, text: "Feeling down, depressed, or hopeless?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 4, text: "Feeling tired or having little energy?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 5, text: "Poor appetite or overeating?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 6, text: "Feeling bad about yourself — or that you are a failure?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 7, text: "Trouble concentrating on things?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 8, text: "Moving or speaking so slowly that others notice?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 9, text: "Thoughts that you would be better off dead?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
    ],
    scoring: { "0-4": "Minimal depression", "5-9": "Mild depression", "10-14": "Moderate depression", "15-19": "Moderately severe depression", "20-27": "Severe depression" },
  },

  // GAD-7 (Anxiety)
  gad7: {
    name: "GAD-7",
    description: "Anxiety severity assessment",
    questions: [
      { id: 1, text: "Feeling nervous, anxious, or on edge?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 2, text: "Not being able to stop or control worrying?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 3, text: "Worrying too much about different things?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 4, text: "Trouble relaxing?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 5, text: "Being so restless that it is hard to sit still?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 6, text: "Becoming easily annoyed or irritable?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
      { id: 7, text: "Feeling afraid as if something awful might happen?", options: [{ label: "Not at all", score: 0 }, { label: "Several days", score: 1 }, { label: "More than half the days", score: 2 }, { label: "Nearly every day", score: 3 }] },
    ],
    scoring: { "0-4": "Minimal anxiety", "5-9": "Mild anxiety", "10-14": "Moderate anxiety", "15-21": "Severe anxiety" },
  },

  // PSS (Perceived Stress Scale)
  pss: {
    name: "PSS",
    description: "Perceived stress over the past month",
    questions: [
      { id: 1, text: "In the last month, how often have you been upset because of something that happened unexpectedly?", options: [{ label: "Never", score: 0 }, { label: "Almost never", score: 1 }, { label: "Sometimes", score: 2 }, { label: "Fairly often", score: 3 }, { label: "Very often", score: 4 }] },
      { id: 2, text: "In the last month, how often have you felt that you were unable to control important things in your life?", options: [{ label: "Never", score: 0 }, { label: "Almost never", score: 1 }, { label: "Sometimes", score: 2 }, { label: "Fairly often", score: 3 }, { label: "Very often", score: 4 }] },
      // ... add remaining 8
    ],
    scoring: { "0-13": "Low stress", "14-26": "Moderate stress", "27-40": "High stress" },
  },

  // ISI (Insomnia Severity Index)
  isi: {
    name: "ISI",
    description: "Insomnia severity assessment",
    questions: [
      { id: 1, text: "Difficulty falling asleep?", options: [{ label: "No problem", score: 0 }, { label: "Mild", score: 1 }, { label: "Moderate", score: 2 }, { label: "Severe", score: 3 }, { label: "Very severe", score: 4 }] },
      { id: 2, text: "Difficulty staying asleep?", options: [{ label: "No problem", score: 0 }, { label: "Mild", score: 1 }, { label: "Moderate", score: 2 }, { label: "Severe", score: 3 }, { label: "Very severe", score: 4 }] },
      // ... add remaining 5
    ],
    scoring: { "0-7": "No clinically significant insomnia", "8-14": "Subthreshold insomnia", "15-21": "Moderate insomnia", "22-28": "Severe insomnia" },
  },

  // Add more assessments similarly...
};
