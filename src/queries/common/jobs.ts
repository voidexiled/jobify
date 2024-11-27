import createServer from "@/utils/supabase/server";

export async function fetchJobs() {
  const supabase = await createServer();

  const { data, error } = await supabase.from("jobs").select("*");
  if (error) {
    console.error(error);
  }

  return data;
}
export async function fetchJobsAndApplications() {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(*), users(*, company_profiles(*))");
  if (error) {
    console.error(error);
  }

  return data;
}

export async function fetchJobsMatchesTitle(title: string) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(*), users(*, company_profiles(*))")
    .ilike("title", `%${title}%`);
  if (error) {
    console.error(error);
  }

  return data;
}

export async function fetchJobsMatchesCompanyName(company: string) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(*), users(*, company_profiles(*))")
    .ilike("company", `%${company}%`);
  if (error) {
    console.error(error);
  }

  return data;
}

export async function fetchJobsMatchesCompanyNameAndTitle(
  title: string,
  companyName: string
) {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, applications(*), users(*, company_profiles(*))")
    .ilike("company", `%${companyName}%`)
    .ilike("title", `%${title}%`);
  if (error) {
    console.error(error);
  }

  return data;
}
