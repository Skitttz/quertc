import { SignIn } from "@clerk/nextjs";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AppRoutesEnum } from "@/shared/route";

export default function SignInPage() {
  return (
    <AuthContainer>
      <SignIn
        routing="path"
        path={AppRoutesEnum.SIGN_IN}
        forceRedirectUrl={AppRoutesEnum.CHAT}
        signUpUrl={AppRoutesEnum.SIGN_UP}
      />
    </AuthContainer>
  );
}
