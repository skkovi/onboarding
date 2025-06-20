import React, { useState } from "react";
import { createClient } from "../../../utils/supabase/client";
export default function LoginStep({ data, onUpdate, onNext }) {
  const [errors, setErrors] = useState({});
  const [signUp, setSignUp] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      if (!signUp) {
        const { data: signInData, error } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrors({ general: error.message });
          } else {
            console.log("Error signing up:", error);
            setErrors({ general: error.message });
            return;
          }
        } else {
          console.log("Signed in successfully:", signInData.user);
          onUpdate({ userId: signInData.user?.id });
          onNext();
        }
      } else {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: data.email.trim(),
            password: data.password,
          });
        if (signUpError) {
          console.log("Error signing in:", signUpError);
          return;
        }
        onUpdate({ userId: signUpData.user?.id });
        onNext();
      }
    } catch (error) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          console.log("Authentication successful despite catch error:", user);
          onUpdate({ userId: user.id });
          onNext();
          return;
        }
      } catch (checkError) {
        console.error("Error checking user status:", checkError);
      }
      console.log("Error during auth:", error);
      setErrors({ general: "Error occurred during auth" });
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
      {signUp ? <p>Sign Up</p> : <p>Sign In</p>}
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
      <div>
        <buton
          type="button"
          onClick={() => {
            setSignUp(!signUp);
            setErrors({});
          }}
        >
          {signUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </buton>
      </div>
    </div>
  );
}
