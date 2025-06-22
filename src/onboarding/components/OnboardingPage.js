"use client";
import React, { useState, useEffect } from "react";
import LoginStep from "./LoginStep";
import AboutMe from "./AboutMe";
import Address from "./Address";
import Birthdate from "./Birthdate";
import { createClient } from "../../../utils/supabase/client";

export default function OnboardingPage() {
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("FORM IS SUCCESSFUL");
    }
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

  const renderStep = () => {
    const renderComponents = (components) => {
      return components.map((component) => {
        if (component === "About Me") {
          return (
            <AboutMe
              key="AboutMe"
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrevious={previousStep}
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
          />
        );
      case 2:
        return <>{renderComponents(componentConfig.page2)}</>;
      case 3:
        return <>{renderComponents(componentConfig.page3)}</>;
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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1>New Onboarding Project</h1>
        {renderStep()}
      </div>
      <div className="max-w-md mx-auto mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Current form data:</h3>
        <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}
