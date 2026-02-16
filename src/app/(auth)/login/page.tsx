import { LoginForm, GuestGuard } from "@/components/auth";

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  );
}
