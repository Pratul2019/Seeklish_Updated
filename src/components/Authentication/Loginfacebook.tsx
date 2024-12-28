

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FaFacebook } from "react-icons/fa";

const LoginFacebook = () => {
  return (
    <Button
      onClick={() => login("facebook")}
      variant="outline"
      size="long"
      className="rounded-xl hover:bg-accent"
    >
      <FaFacebook className="text-blue-500" />
      <span>Continue with Facebook</span>
    </Button>
  );
};

export default LoginFacebook;