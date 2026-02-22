import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallback() {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await refresh();
      navigate("/account", { replace: true });
    })();
  }, [navigate, refresh]);

  return <div className="p-6 text-center">Signing you in…</div>;
}