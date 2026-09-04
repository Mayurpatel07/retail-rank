import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const user = await login(data.email, data.password);

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "STORE_OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/stores");
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Unable to login. Try again."
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-icon">
            <Star size={18} fill="currentColor" />
          </div>
          <span>StoreRate</span>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your account.</p>
        </div>
        <div className="auth-heading">
  <h1>Welcome back</h1>
  <p>Sign in to continue to your account.</p>
</div>

{location.state?.message && (
  <div className="form-success">{location.state.message}</div>
)}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <small>{errors.email.message}</small>
            )}
          </label>

          <label>
            Password
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <small>{errors.password.message}</small>
            )}
          </label>

          {serverError && <div className="form-error">{serverError}</div>}

          <button className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
}