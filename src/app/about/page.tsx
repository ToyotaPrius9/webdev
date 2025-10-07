import { studentInfo } from "@/config";

export default function AboutPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p>Name: {studentInfo.name}</p>
      <p>Student Number: {studentInfo.number}</p>
      <video controls width="400" className="mt-4 rounded border">
        <source src="/TutorialAssignment1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
