import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Star } from "lucide-react";
import api from "../../services/api";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Enter a valid email"),
  address: z
    .string()
    .trim()
    .max(400, "Address must not exceed 400 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password needs a special character"),
});

export default function Signup() {
  const navigate = useNavigate();
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

      await api.post("/auth/signup", data);

      navigate("/login", {
        state: { message: "Account created. You can now sign in." },
      });
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Unable to create account."
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card signup-card">
        <div className="brand">
          <div className="brand-icon">
            <Star size={18} fill="currentColor" />
          </div>
          <span>StoreRate</span>
        </div>

        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Join StoreRate and start rating stores.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label>
            Full name
            <input
              placeholder="Your full name"
              {...register("name")}
            />
            {errors.name && <small>{errors.name.message}</small>}
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && <small>{errors.email.message}</small>}
          </label>

          <label>
            Address
            <textarea
              placeholder="Your address"
              rows="3"
              {...register("address")}
            />
            {errors.address && (
              <small>{errors.address.message}</small>
            )}
          </label>

          <label>
            Password
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="8–16 characters"
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

          <p className="password-hint">
            8–16 characters, including one uppercase letter and one special
            character.
          </p>

          {serverError && <div className="form-error">{serverError}</div>}

          <button className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}