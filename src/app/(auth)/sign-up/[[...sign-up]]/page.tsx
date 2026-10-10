import { SignUp } from "@clerk/nextjs";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AppRoutesEnum } from "@/shared/route";

export default function SignUpPage() {
  return (
    <AuthContainer>
      <SignUp
        routing="path"
        path={AppRoutesEnum.SIGN_UP}
        forceRedirectUrl={AppRoutesEnum.CHAT}
        signInUrl={AppRoutesEnum.SIGN_IN}
      />
    </AuthContainer>
  );
}
