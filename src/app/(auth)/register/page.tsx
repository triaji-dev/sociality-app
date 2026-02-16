import { RegisterForm, GuestGuard } from "@/components/auth";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterForm />
    </GuestGuard>
  );
}
