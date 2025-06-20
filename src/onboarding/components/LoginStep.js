import React, { useState } from "react";

export default function LoginStep({ data, onUpdate }) {
  const [errors, setErrors] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    let field = e.target.name;
    let value = e.target.value;
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-md text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Username"
          value={data.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
        <label className="block text-sm font-md text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
