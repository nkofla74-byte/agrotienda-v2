import { createClient } from "@/utils/supabase/server";
import LoginForm from "@/components/admin/LoginForm";
import DashboardClient from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return <LoginForm />;
  }

  return <DashboardClient userEmail={user.email || 'Admin'} />;
}