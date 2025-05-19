import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState([{ name: "", chapters: 0, examDate: "" }]);
  const [dailyHours, setDailyHours] = useState(2);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", chapters: 0, examDate: "" }]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://your-backend-url.com/generate-plan", {
        subjects,
        dailyHours,
      });
      setPlan(res.data.plan);
    } catch (error) {
      console.error("Error generating study plan:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Smart Study Planner</h1>

      {subjects.map((subj, idx) => (
        <div key={idx} className="mb-4 grid grid-cols-3 gap-4">
          <Input
            placeholder="Subject"
            value={subj.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Chapters"
            value={subj.chapters}
            onChange={(e) => handleChange(idx, "chapters", parseInt(e.target.value))}
          />
          <Input
            type="date"
            value={subj.examDate}
            onChange={(e) => handleChange(idx, "examDate", e.target.value)}
          />
        </div>
      ))}

      <Button onClick={addSubject} className="mb-4">
        Add Subject
      </Button>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Daily Study Hours"
          value={dailyHours}
          onChange={(e) => setDailyHours(parseInt(e.target.value))}
        />
      </div>

      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Study Plan"}
      </Button>

      {plan && (
        <Card className="mt-6">
          <CardContent className="overflow-x-auto">
            <h2 className="text-lg font-semibold mb-2">Your Study Plan</h2>
            <table className="table-auto w-full text-sm">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2">Chapter</th>
                  <th className="border px-4 py-2">Hours</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((entry, i) => (
                  <tr key={i}>
                    <td className="border px-4 py-2">{entry.date}</td>
                    <td className="border px-4 py-2">{entry.subject}</td>
                    <td className="border px-4 py-2">{entry.chapter}</td>
                    <td className="border px-4 py-2">{entry.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
