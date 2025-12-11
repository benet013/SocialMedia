import AuthForm from "../components/authForm";

function LoginPage() {
  return (
    <AuthForm method="login" route="/api/token/" />
  )
}

export default LoginPage;