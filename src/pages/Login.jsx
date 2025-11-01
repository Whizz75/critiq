import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8">Welcome to Critiq</h1>
      <Button
        onClick={handleLogin}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition"
      >
        Sign in with Google
      </Button>
    </div>
  );
}
