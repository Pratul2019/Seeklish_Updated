

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

const LoginGithub = () => {
  return (
    <Button
      onClick={() => login("github")}
      variant="outline"
      size="long"
      className="rounded-xl hover:bg-accent"
    >
      <FaGithub className="text-purple-500" />
      <span>Continue with Github</span>
    </Button>
  );
};

export default LoginGithub;