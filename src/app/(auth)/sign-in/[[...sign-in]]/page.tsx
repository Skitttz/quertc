import { SignIn } from '@clerk/nextjs'
import { AuthContainer } from "@/components/auth/AuthContainer"

export default function SignInPage() {
  return <AuthContainer> <SignIn /> </AuthContainer>
}