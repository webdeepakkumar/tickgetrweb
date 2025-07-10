import ProtectedRoute from "@/app/[locale]/components/protectedRoute";

export default function UserLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
