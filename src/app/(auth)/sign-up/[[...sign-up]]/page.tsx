import { SignUp } from "@clerk/nextjs";
import { AuthContainer } from "@/components/auth/AuthContainer";

export default function SignUpPage() {
  return (
    <AuthContainer>
      <SignUp />
    </AuthContainer>
  );
}
