import { createClient } from "../../../utils/supabase/client";
const supabase = createClient();

export const signUpUser = async (email, password) => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (signUpError) {
    throw new Error(signUpError.message);
  }
  const userId = signUpData.user?.id;
  if (!userId) {
    throw new Error("User Id not found");
  }
  return userId;
};

export const signInUser = async (email, password) => {
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return signInData.user?.id;
};

export const getUserStep = async (userId) => {
  const { data: userStepData, error: fetchError } = await supabase
    .from("users")
    .select("current_step")
    .eq("userId", userId);
  if (fetchError) {
    throw new Error(error.message);
  }
  let step = userStepData?.[0]?.current_step ?? 2;
  return step;
};

export const insertNewUser = async (userId, email) => {
  const { error: fetchError } = await supabase
    .from("users")
    .insert([{ userId, email, current_step: 2 }]);
  if (fetchError) {
    throw new Error(error.message);
  }
};
