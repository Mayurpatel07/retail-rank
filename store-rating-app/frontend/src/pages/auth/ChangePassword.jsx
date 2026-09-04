import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../../services/api";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function ChangePassword() {
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values) => {
    try {
      setServerError("");
      setSuccess("");

      await api.patch("/auth/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setSuccess("Password changed successfully.");
      reset();
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="brand">
          <div className="brand-icon">
            <Lock size={18} />
          </div>

          StoreRate
        </div>

        <div className="auth-heading">
          <h1>Change password</h1>
          <p>
            Update your password to keep your account secure.
          </p>
        </div>

        {serverError && (
          <div className="form-error">
            {serverError}
          </div>
        )}

        {success && (
          <div className="form-success">
            {success}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* Current password */}
          <label>
            Current password

            <div className="password-input">
              <input
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent((value) => !value)
                }
              >
                {showCurrent ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {errors.currentPassword && (
              <small>
                {errors.currentPassword.message}
              </small>
            )}
          </label>

          {/* New password */}
          <label>
            New password

            <div className="password-input">
              <input
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew((value) => !value)
                }
              >
                {showNew ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <small>
                {errors.newPassword.message}
              </small>
            )}

            <p className="password-hint">
              8–16 characters, including at least one
              uppercase letter and one special character.
            </p>
          </label>

          {/* Confirm password */}
          <label>
            Confirm new password

            <div className="password-input">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm((value) => !value)
                }
              >
                {showConfirm ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <small>
                {errors.confirmPassword.message}
              </small>
            )}
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Updating..."
              : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
}