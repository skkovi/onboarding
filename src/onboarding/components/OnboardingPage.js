"use client";
import React, { useState } from "react";
import LoginStep from "./LoginStep";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("FORM IS SUCCESSFUL");
    }
  };

  const updateFormData = (data) => {
    setFormData((prev) => {
      return { ...prev, ...data };
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1>New Onboarding Project</h1>
        <div>
          <LoginStep data={formData} onUpdate={updateFormData} />
        </div>
      </div>
    </div>
  );
}
