import { SignUp } from '@clerk/nextjs'
import { AuthContainer } from '@/presentation/auth/components/AuthContainer'

export default function SignUpPage() {
  return <AuthContainer>
    <SignUp />
  </AuthContainer>
}