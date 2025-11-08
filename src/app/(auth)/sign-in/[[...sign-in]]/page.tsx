import { SignIn } from '@clerk/nextjs'
import { AuthContainer } from "@/presentation/auth/components/AuthContainer"

export default function SignInPage() {
  return <AuthContainer> <SignIn /> </AuthContainer>
}