import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { Step1 } from "@/features/auth/components/register/Step1";

export default function RegisterEmailPage() {
  return (
    <AuthLayout>
      <Step1 />
    </AuthLayout>
  );
}
