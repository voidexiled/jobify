import createServer from "@/utils/supabase/server";

export async function applyForJob(jobId: string, userId: string) {
  const supabase = await createServer();
  const { data, error } = await supabase.from("applications").insert({
    job_id: jobId,
    user_id: userId,
  });
  console.log("data", data);
  console.log("error", error);

  return error;
}
