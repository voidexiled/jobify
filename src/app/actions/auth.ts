"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createServer from "@/utils/supabase/server";
import { QueryClient } from "@tanstack/react-query";

export async function revalidateAll() {
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createServer();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: dataUser, error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    return;
  }
  // Update public.users profileType
  const profileType = formData.get("profileType") as string;
  if (dataUser?.user) {
    const { data: dataUpdateProfile, error: errorUpdateProfile } =
      await supabase
        .from("users")
        .update({
          profile_type: profileType,
        })
        .eq("id", dataUser.user.id)
        .single();
    if (errorUpdateProfile) {
      console.log(errorUpdateProfile);
      return;
    }
    console.log(dataUpdateProfile);
  }

  // Create public.company_profiles or public.employee_profiles

  if (profileType === "company") {
    const { data: dataCreateCompanyProfile, error: errorCreateCompanyProfile } =
      await supabase.from("company_profiles").insert({
        company_name: formData.get("name") as string,
      });

    if (errorCreateCompanyProfile) {
      console.log(errorCreateCompanyProfile);
      return;
    }
    console.log(dataCreateCompanyProfile);
  } else if (profileType === "employee") {
    const {
      data: dataCreateEmployeeProfile,
      error: errorCreateEmployeeProfile,
    } = await supabase.from("employee_profiles").insert({
      full_name: formData.get("name") as string,
    });

    if (errorCreateEmployeeProfile) {
      console.log(errorCreateEmployeeProfile);
      return;
    }
    console.log(dataCreateEmployeeProfile);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
