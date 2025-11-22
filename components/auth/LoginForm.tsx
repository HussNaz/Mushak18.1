"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const email = watch("email");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Store token (mock)
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Redirect based on role (mock)
        if (result.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/applicant");
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="login-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="login-header">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          className="login-alert error"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="login-alert-icon">⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <motion.div
          className="login-floating-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="login-input-icon">📧</span>
          <input
            type="email"
            className={`login-input ${
              errors.email
                ? "error"
                : touchedFields.email && !errors.email
                ? "success"
                : ""
            }`}
            placeholder="Email address"
            {...register("email")}
          />
          <label className="login-floating-label">Email address</label>

          {/* Email validation tooltip */}
          {errors.email && (
            <motion.div
              className="login-tooltip error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="login-tooltip-icon">❌</span>
              <span>{errors.email.message}</span>
            </motion.div>
          )}
          {touchedFields.email && !errors.email && email && (
            <motion.div
              className="login-tooltip success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="login-tooltip-icon">✓</span>
              <span>Email looks good!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          className="login-floating-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="login-input-icon">🔒</span>
          <input
            type="password"
            className={`login-input ${
              errors.password
                ? "error"
                : touchedFields.password && !errors.password
                ? "success"
                : ""
            }`}
            placeholder="Password"
            {...register("password")}
          />
          <label className="login-floating-label">Password</label>

          {/* Password validation tooltip */}
          {errors.password && (
            <motion.div
              className="login-tooltip error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="login-tooltip-icon">❌</span>
              <span>{errors.password.message}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Forgot Password Link */}
        <motion.div
          className="login-forgot-password"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link href="/auth/reset-password">Forgot Password?</Link>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            type="submit"
            className="login-btn-gradient"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="login-spinner"></span>
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          className="login-signup-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          New to Mushak 18.1?
          <Link href="/auth/signup">Create an Account</Link>
        </motion.div>
      </form>
    </motion.div>
  );
}
