import React, { useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import {
  signUpUser,
  signInUser,
  getUserStep,
  insertNewUser,
} from "@/lib/api/auth";
export default function LoginStep({ data, onUpdate, setStep }) {
  const [errors, setErrors] = useState({});
  const [signUp, setSignUp] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    const email = data.email.trim();
    const password = data.password;
    const newErrors = {};
    try {
      let userId;
      if (!email) {
        newErrors.email = "Email is required";
      }
      if (!password) {
        newErrors.password = "Password is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setisLoading(false);
        return;
      }
      if (signUp) {
        userId = await signUpUser(email, password);
      } else {
        userId = await signInUser(email, password);
      }
      onUpdate({ userId });
      let step = await getUserStep(userId);
      if (!step) {
        await insertNewUser(userId, email);
        step = 2;
      }
      onUpdate((prev) => ({ ...prev, ...data, current_step: step }));
      setStep(step);
    } catch (error) {
      console.log("Error during auth:", error);
      setErrors({ general: error.message });
    } finally {
      setisLoading(false);
    }
  };

  const handleChange = (e) => {
    let field = e.target.name;
    let value = e.target.value;
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {errors.general && (
        <p className="text-red-500 text-sm mt-1">{errors.general}</p>
      )}
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
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
        ></input>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
        <label className="block text-sm font-md text-gray-700 mb-2 mt-4">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
        ></input>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
      <div>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            setSignUp(!signUp);
            setErrors({});
          }}
        >
          {signUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
