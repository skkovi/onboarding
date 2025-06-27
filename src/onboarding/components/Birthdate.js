import React, { useState, useEffect } from "react";
export default function Birthdate({ data, onUpdate, onRegister }) {
  const [errors, setErrors] = useState({});
  const handleSubmit = () => {
    console.log("Submitting birth date:", data.birthDate);
    if (!data.birthDate) {
      setErrors({ birthDate: "Birth date is required" });
      return false;
    }
    return true;
  };
  const handleChange = (e) => {
    let value = e.target.value;
    onUpdate({ birthDate: value });
  };
  useEffect(() => {
    onRegister(() => handleSubmit());
  }, [data]);
  return (
    <div>
      {errors.birthDate && (
        <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
      )}
      <label className="block text-sm font-md text-gray-700 mb-2">
        Birth Date:
      </label>
      <input
        type="date"
        name="birthDate"
        value={data.birthDate}
        onChange={handleChange}
      ></input>
    </div>
  );
}
