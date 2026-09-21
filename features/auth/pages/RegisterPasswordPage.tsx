import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { RegisterCouponSync } from "@/features/auth/components/register/RegisterCouponSync";
import { Step2 } from "@/features/auth/components/register/Step2";

type RegisterPasswordPageProps = {
  couponCode?: string | null;
};

export default function RegisterPasswordPage({
  couponCode = null,
}: RegisterPasswordPageProps) {
  return (
    <AuthLayout>
      <RegisterCouponSync couponCode={couponCode} />
      <Step2 />
    </AuthLayout>
  );
}
