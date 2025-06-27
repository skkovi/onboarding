import { createClient } from "../../../utils/supabase/client";
const supabase = createClient();

export const fetchComponentConfig = async () => {
  const { data } = await supabase
    .from("component_config")
    .select("*")
    .limit(1)
    .single();
  if (data) {
    return {
      page2: data.page2_components || [],
      page3: data.page3_components || [],
    };
  }
};

export const upsertUserData = async (filteredData) => {
  const { error } = await supabase
    .from("users")
    .upsert([filteredData], { onConflict: "email" });
  if (error) {
    console.error("Error inserting data:", error);
    return false;
  }
  return true;
};

export const updateCurrentStep = async (userId, step) => {
  const { error } = await supabase
    .from("users")
    .update({ current_step: step })
    .eq("userId", userId);
  if (error) {
    console.log("Error updating step: ", error);
  }
  return true;
};
