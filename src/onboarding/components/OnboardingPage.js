"use client";
import React, { useState, useEffect, useRef } from "react";
import LoginStep from "./LoginStep";
import AboutMe from "./AboutMe";
import Address from "./Address";
import Birthdate from "./Birthdate";
import ProgressIndicator from "./ProgressIndicator";
import { createClient } from "../../../utils/supabase/client";
import {
  fetchComponentConfig,
  upsertUserData,
  updateCurrentStep,
} from "@/lib/api/wizard";

export default function OnboardingPage() {
  const submitFnsRef = useRef([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [componentConfig, setComponentConfig] = useState({
    page2: [],
    page3: [],
  });
  const componentMap = {
    "About Me": AboutMe,
    Address: Address,
    Birthdate: Birthdate,
  };
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
      await updateCurrentStep(formData.userId, newStep);
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
    try {
      await upsertUserData(filteredData);
      return true;
    } catch (err) {
      console.log(err);
      setHasSubmitted(false);
      return false;
    }
  };

  const renderStep = () => {
    const renderComponents = (components) => {
      submitFnsRef.current = [];
      return components.map((component, index) => {
        const StepComponent = componentMap[component];
        return (
          <StepComponent
            key={component}
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrevious={previousStep}
            onRegister={(fn) => registerSubmitFn(index, fn)}
          />
        );
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
            <div className="flex justify-between gap-4 mt-6">
              <button
                type="submit"
                onClick={previousStep}
                className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-4"
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handlePageSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              >
                Submit
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            {renderComponents(componentConfig.page3)}
            <div className="flex justify-between gap-4 mt-6">
              <button
                type="submit"
                onClick={previousStep}
                className="flex-1 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-4"
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handlePageSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              >
                Submit
              </button>
            </div>
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
      const config = await fetchComponentConfig();
      setComponentConfig(config);
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
