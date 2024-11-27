import type { Tables } from "@/types/supabase_public";
import createServer from "@/utils/supabase/server";

export async function fetchUser() {
  const supabase = await createServer();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
  }

  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select("*, company_profiles(*), employee_profiles(*)")
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    .eq("id", data.user?.id!)
    .single();
  if (error) {
    console.error(error);
  }

  return profileData;
}

export async function fetchUsers() {
  const supabase = await createServer();

  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error(error);
  }

  return data;
}

export async function fetchUsersByProfileType(
  profileType: Extract<Tables<"users">["profile_type"], string>
) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("profile_type", profileType);
  if (error) {
    console.error(error);
  }

  return data;
}

export async function fetchUserById(id: string) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("users")
    .select("*, company_profiles(*), employee_profiles(*)")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
  }
  console.log(data);

  return data;
}

export async function fetchUserByEmail(email: string) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) {
    console.error(error);
  }

  return data;
}
