
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

const LoginGoogle = () => {
  return (
    <Button
      onClick={() => login("google")}
      variant="outline"
      size="long"
      className="rounded-xl hover:bg-accent"
    >
      <FaGoogle className="text-red-500" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default LoginGoogle;