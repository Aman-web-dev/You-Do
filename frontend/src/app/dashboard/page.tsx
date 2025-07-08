import TodoListPage from "@/components/ToDoComponent";
import { createClient } from "@/utils/server";

import React from "react";

async function page() {
  console.log("refreshing")
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { data: todosData } = await supabase
    .from("tasks_task")
    .select("*")
    .eq("user_id", user?.id);
console.log(todosData)
  return <TodoListPage todosData={todosData} />;
}

export default page;
