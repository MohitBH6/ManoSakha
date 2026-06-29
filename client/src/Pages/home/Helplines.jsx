import React from "react";
import { Phone } from "lucide-react";

const helplines = [
  { name: "Police", number: "100" },
  { name: "Ambulance", number: "102" },
  { name: "Fire", number: "101" },
  { name: "Women Helpline", number: "1091" },
  { name: "Child Helpline", number: "1098" },
  { name: "Mental Health Helpline (KIRAN)", number: "18005990019" },
  { name: "Disaster Management", number: "108" },
  { name: "Senior Citizen Helpline", number: "14567" },
];

export default function Helplines() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Emergency & Mental Health Helplines (India)</h1>
      
      <div className="grid gap-4">
        {helplines.map((helpline, index) => (
          <a
            key={index}
            href={`tel:${helpline.number}`}
            className="flex items-center justify-between p-4 bg-white shadow rounded-2xl hover:shadow-md transition"
          >
            <div>
              <p className="text-lg font-semibold">{helpline.name}</p>
              <p className="text-gray-600">{helpline.number}</p>
            </div>
            <Phone className="text-green-600" size={24} />
          </a>
        ))}
      </div>
    </div>
  );
}
