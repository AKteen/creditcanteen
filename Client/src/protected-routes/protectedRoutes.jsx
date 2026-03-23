import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (data?.role === role) {
      setAllowed(true);
    } else {
      setAllowed(false);
    }

    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;

  if (!allowed) return <Navigate to="/" />;

  return children;
}