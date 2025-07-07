import { redirect } from "next/navigation";
import { createClient } from "@/utils/server";

async function layout({ children }: { children: any }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();


  if (error || !data?.user) {
    redirect("/auth");
  } else {
    return (
      <div>
       
        {children}
      </div>
    );
  }
}

export default layout;
