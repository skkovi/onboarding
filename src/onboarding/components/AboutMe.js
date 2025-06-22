import { useEffect } from "react";
export default function AboutMe({ data, onUpdate, onNext, onRegister }) {
  const handleSubmit = (e) => {
    return true;
  };

  const handleChange = (e) => {
    let field = e.target.name;
    let value = e.target.value;
    onUpdate({ [field]: value });
  };

  useEffect(() => {
    onRegister(() => handleSubmit());
  }, [data]);

  return (
    <div>
      <label className="block text-sm font-md text-gray-700 mb-2">
        About Me
      </label>
      <textarea
        name="aboutMe"
        value={data.aboutMe}
        onChange={handleChange}
        rows="4"
        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tell us about yourself..."
      ></textarea>
    </div>
  );
}
