import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";
import { RegisterCouponSync } from "@/features/auth/components/register/RegisterCouponSync";
import { Step1 } from "@/features/auth/components/register/Step1";

type RegisterEmailPageProps = {
  couponCode?: string | null;
};

export default function RegisterEmailPage({
  couponCode = null,
}: RegisterEmailPageProps) {
  return (
    <AuthLayout>
      <RegisterCouponSync couponCode={couponCode} />
      <Step1 />
    </AuthLayout>
  );
}
