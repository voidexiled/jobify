import createServer from "@/utils/supabase/server";

export async function fetchCompanyUserProfile() {
  const supabase = await createServer();

  const { data: dataUser, error: errorUser } = await supabase.auth.getUser();

  if (errorUser) {
    console.error(errorUser);
    return;
  }
  if (!dataUser.user) {
    console.error("No user found");
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*, company_profiles(*)")
    .eq("id", dataUser.user.id)
    .single();

  if (error) {
    console.error(error);
    return;
  }
  return data;
}
