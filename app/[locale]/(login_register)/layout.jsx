import NonAuthProtectedRoute from "../components/nonAuthProtectedRoute";

export default function LoginRegisterLayout({ children }) {
  return <NonAuthProtectedRoute>{children}</NonAuthProtectedRoute>;
}
