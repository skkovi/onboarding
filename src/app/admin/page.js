"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function Admin() {
  const supabase = createClient();
  const [adminData, setAdminData] = useState({
    page2: ["About Me", "Birthdate"],
    page3: ["Address"],
  });
  const allComponents = ["Birthdate", "About Me", "Address"];
  let getComponentPage = (component) => {
    if (adminData.page2.includes(component)) {
      return "page2";
    }
    if (adminData.page3.includes(component)) {
      return "page3";
    }
    return null;
  };
  let handleChange = async (component, targetPage) => {
    let currentPage = getComponentPage(component);
    if (!currentPage || currentPage === targetPage) return;
    if (adminData[currentPage].length === 1) {
      alert("You cannot remove the last component from a page.");
      return;
    }
    const updatedAdmin = {
      ...adminData,
      [currentPage]: adminData[currentPage].filter(
        (comp) => comp !== component
      ),
      [targetPage]: [...adminData[targetPage], component],
    };
    setAdminData(updatedAdmin);
    const { data: row, error } = await supabase
      .from("component_config")
      .select("*")
      .single();
    await supabase
      .from("component_config")
      .update({
        page2_components: updatedAdmin.page2,
        page3_components: updatedAdmin.page3,
      })
      .eq("id", row.id);
  };
  useEffect(() => {
    const fetchAdminData = async () => {
      const { data } = await supabase
        .from("component_config")
        .select("*")
        .limit(1)
        .single();
      if (data) {
        setAdminData({
          page2: data.page2_components || [],
          page3: data.page3_components || [],
        });
      }
    };
    fetchAdminData();
  }, []);
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-700">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Configure Onboarding Flow Components</p>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Page Components</h3>
            {allComponents.map((component) => {
              let page = getComponentPage(component);
              return (
                <div
                  key={component}
                  className="flex items-center justify-between p-2 bg-white rounded mb-2"
                >
                  <span>{component}</span>
                  <select
                    className="text-red-500 hover:text-red-700"
                    value={page || "unassigned"}
                    onChange={(e) => {
                      handleChange(component, e.target.value);
                    }}
                  >
                    <option value="page2">Page 2</option>
                    <option value="page3">Page 3</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
