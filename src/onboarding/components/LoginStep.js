import React, { useState } from "react";
import { createClient } from "../../../utils/supabase/client";
export default function LoginStep({ data, onUpdate, setStep }) {
  const [errors, setErrors] = useState({});
  const [signUp, setSignUp] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    const newErrors = {};
    if (!data.email) {
      newErrors.email = "Email is required";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setisLoading(false);
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
            setisLoading(false);
            return;
          }
        } else {
          console.log("Signed in successfully:", signInData.user);
          onUpdate({ userId: signInData.user?.id });
          const { data: userStepData, error: fetchError } = await supabase
            .from("users")
            .select("current_step")
            .eq("userId", signInData.user?.id);
          if (fetchError) {
            setErrors({ general: fetchError.message });
            setStep(1);
            setisLoading(false);
            return;
          } else {
            let step = userStepData?.[0]?.current_step;
            if (!step || step === 1) {
              step = 2;
            }
            onUpdate({ current_step: step });
            setStep(step);
          }
          return;
        }
      } else {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: data.email.trim(),
            password: data.password,
          });
        const { data: userStepData, error: fetchError } = await supabase
          .from("users")
          .select("current_step")
          .eq("userId", signUpData.user?.id);
        if (fetchError) {
          setErrors({ general: fetchError.message });
          setStep(1);
          setisLoading(false);
          return;
        } else {
          let step = userStepData?.[0]?.current_step;
          if (!step || step === 1) {
            step = 2;
          }
          onUpdate({ current_step: step });
          setStep(step);
        }
        if (signUpError) {
          console.log("Error signing in:", signUpError);
          setisLoading(false);
          return;
        }
        const userId = signUpData.user?.id;
        onUpdate({ userId: userId });
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("current_step")
          .eq("userId", userId);
        if (error) {
          setErrors({ general: error.message });
          return;
        }
        if (!existingUser || existingUser.length === 0) {
          console.log("No existing user found, creating new user");
          const { error: insertError } = await supabase
            .from("users")
            .insert([{ userId, email: data.email, current_step: 2 }]);
          if (insertError) {
            setErrors({ general: insertError.message });
            return;
          }
          onUpdate({ current_step: 2 });
          setStep(2);
        } else {
          console.log("Existing user found:", existingUser);
          const userStep = existingUser[0]?.current_step || 2;
          onUpdate({ current_step: userStep });
          setStep(userStep);
          console.log("Step set to:", userStep);
        }
      }
    } catch (error) {
      console.log("Error during auth:", error);
      setErrors({ general: "Error occurred during auth" });
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
