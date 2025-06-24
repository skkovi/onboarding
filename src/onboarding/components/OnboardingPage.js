"use client";
import React, { useState, useEffect, useRef } from "react";
import LoginStep from "./LoginStep";
import AboutMe from "./AboutMe";
import Address from "./Address";
import Birthdate from "./Birthdate";
import ProgressIndicator from "./ProgressIndicator";
import { createClient } from "../../../utils/supabase/client";

export default function OnboardingPage() {
  const supabase = createClient();
  const submitFnsRef = useRef([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [componentConfig, setComponentConfig] = useState({
    page2: [],
    page3: [],
  });
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
    aboutMe: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    birthDate: "",
  });

  const registerSubmitFn = (step, fn) => {
    submitFnsRef.current[step] = fn;
  };
  const handlePageSubmit = async () => {
    for (let fn of submitFnsRef.current) {
      const result = await fn();
      if (!result) return;
    }
    const update = await postData();
    if (!update) {
      console.error("Error submitting data");
      setHasSubmitted(false);
      return;
    }
    nextStep();
  };

  const nextStep = async () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    if (formData.userId) {
      console.log("Updating current_step to:", newStep);
      await supabase
        .from("users")
        .update({ current_step: newStep })
        .eq("userId", formData.userId);
    }
    return newStep;
  };
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data) => {
    setFormData((prev) => {
      return { ...prev, ...data };
    });
  };

  const postData = async () => {
    setHasSubmitted(true);
    const { address, ...rest } = formData;
    const flattenedData = {
      ...rest,
      ...address,
    };
    const filteredData = {};
    for (const key in flattenedData) {
      if (
        flattenedData[key] !== undefined &&
        flattenedData[key] !== null &&
        flattenedData[key] !== ""
      ) {
        filteredData[key] = flattenedData[key];
      }
    }

    const { error } = await supabase
      .from("users")
      .upsert([filteredData], { onConflict: "email" });
    if (error) {
      console.error("Error inserting data:", error);
      setHasSubmitted(false);
      return false;
    }
    return true;
  };

  const renderStep = () => {
    const renderComponents = (components) => {
      submitFnsRef.current = [];
      return components.map((component, index) => {
        if (component === "About Me") {
          return (
            <AboutMe
              key="AboutMe"
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrevious={previousStep}
              onRegister={(fn) => registerSubmitFn(index, fn)}
            />
          );
        }
        if (component === "Address") {
          return (
            <Address
              key="Address"
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrevious={previousStep}
              onRegister={(fn) => registerSubmitFn(index, fn)}
            />
          );
        }
        if (component === "Birthdate") {
          return (
            <Birthdate
              key="Birthdate"
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrevious={previousStep}
              onRegister={(fn) => registerSubmitFn(index, fn)}
            />
          );
        }
        return null;
      });
    };
    switch (currentStep) {
      case 1:
        return (
          <LoginStep
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            setStep={setCurrentStep}
          />
        );
      case 2:
        return (
          <>
            {renderComponents(componentConfig.page2)}
            <button
              type="submit"
              onClick={handlePageSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            >
              Submit
            </button>
          </>
        );
      case 3:
        return (
          <>
            {renderComponents(componentConfig.page3)}
            <button
              type="submit"
              onClick={handlePageSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            >
              Submit
            </button>
          </>
        );
      case 4:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Onboarding Complete!</h2>
            <p className="mb-4">
              Thank you for completing the onboarding process.
            </p>
          </div>
        );
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("component_config")
        .select("*")
        .limit(1)
        .single();
      if (data) {
        setComponentConfig({
          page2: data.page2_components || [],
          page3: data.page3_components || [],
        });
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <ProgressIndicator currentStep={currentStep} />
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-gray-700 mt-6">
        <h1 className="text-xl font-bold mb-4">Welcome To Onboarding!</h1>
        {renderStep()}
      </div>
    </div>
  );
}
