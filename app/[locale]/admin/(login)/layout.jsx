import NonAuthProtectedRoute from "../../components/nonAuthAdminProtectedRoute";

export default function AdminLayout({ children }) {
  return <NonAuthProtectedRoute>{children}</NonAuthProtectedRoute>;
}
