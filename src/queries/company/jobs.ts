import type { Tables } from "@/types/supabase_public";
import createServer from "@/utils/supabase/server";

export async function fetchJobById(id: Tables<"jobs">["id"]) {
  const supabase = await createServer();
  console.log("id", id);
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, applications(*, users(*, employee_profiles(*))), users(*, company_profiles(*))"
    )
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
  }

  return data;
}

export async function fetchCompanyJobsMatchesTitle(title: string) {
  const supabase = await createServer();
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error(authError);
    return;
  }
  if (!authUser.user) {
    console.error("No user found");
    return;
  }
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(*), users(*, company_profiles(*))")
    .eq("company_id", authUser.user.id)
    .textSearch("title", title);
  if (error) {
    console.error(error);
  }
  console.log(data);

  return data;
}

export async function addJobToCompany(job: Tables<"jobs">) {
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
    .from("jobs")
    .insert([
      {
        ...job,
        company_id: dataUser.user.id,
      },
    ])
    .single();
  if (error) {
    console.error(error);
  }
  return data;
}
