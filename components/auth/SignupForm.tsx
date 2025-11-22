"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

type PasswordStrength = "weak" | "medium" | "strong" | "";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const password = watch("password");
  const email = watch("email");

  // Password strength calculator
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      setPasswordStrength("weak");
    } else if (strength <= 4) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  }, [password]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Store token (mock)
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        router.push("/applicant");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="signup-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="signup-header">
        <h2 className="signup-title">Sign Up</h2>
        <p className="signup-subtitle">Create your account to get started</p>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          className="signup-alert error"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="signup-alert-icon">⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <motion.div
          className="signup-floating-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="signup-input-icon">📧</span>
          <input
            type="email"
            className={`signup-input ${
              errors.email
                ? "error"
                : touchedFields.email && !errors.email
                ? "success"
                : ""
            }`}
            placeholder="Email address"
            {...register("email")}
          />
          <label className="signup-floating-label">Email address</label>

          {/* Email validation tooltip */}
          {errors.email && (
            <motion.div
              className="signup-tooltip error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="signup-tooltip-icon">❌</span>
              <span>{errors.email.message}</span>
            </motion.div>
          )}
          {touchedFields.email && !errors.email && email && (
            <motion.div
              className="signup-tooltip success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="signup-tooltip-icon">✓</span>
              <span>Email looks good!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          className="signup-floating-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className="signup-input-icon">🔒</span>
          <input
            type="password"
            className={`signup-input ${
              errors.password
                ? "error"
                : touchedFields.password && !errors.password
                ? "success"
                : ""
            }`}
            placeholder="Password"
            {...register("password")}
          />
          <label className="signup-floating-label">Password</label>

          {/* Password strength meter */}
          {password && (
            <div className="password-strength-meter">
              <div className="password-strength-bar">
                <motion.div
                  className={`password-strength-fill ${passwordStrength}`}
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      passwordStrength === "weak"
                        ? "33.33%"
                        : passwordStrength === "medium"
                        ? "66.66%"
                        : "100%",
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className={`password-strength-text ${passwordStrength}`}>
                {passwordStrength === "weak" && "Weak Password"}
                {passwordStrength === "medium" && "Medium Password"}
                {passwordStrength === "strong" && "Strong Password"}
              </div>
            </div>
          )}

          {/* Password validation tooltip */}
          {errors.password && (
            <motion.div
              className="signup-tooltip error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="signup-tooltip-icon">❌</span>
              <span>{errors.password.message}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          className="signup-floating-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="signup-input-icon">🔒</span>
          <input
            type="password"
            className={`signup-input ${
              errors.confirmPassword
                ? "error"
                : touchedFields.confirmPassword && !errors.confirmPassword
                ? "success"
                : ""
            }`}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          <label className="signup-floating-label">Confirm Password</label>

          {/* Confirm password validation tooltip */}
          {errors.confirmPassword && (
            <motion.div
              className="signup-tooltip error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="signup-tooltip-icon">❌</span>
              <span>{errors.confirmPassword.message}</span>
            </motion.div>
          )}
          {touchedFields.confirmPassword &&
            !errors.confirmPassword &&
            watch("confirmPassword") && (
              <motion.div
                className="signup-tooltip success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="signup-tooltip-icon">✓</span>
                <span>Passwords match!</span>
              </motion.div>
            )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            type="submit"
            className="signup-btn-gradient"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="signup-spinner"></span>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </motion.div>

        {/* Login Link */}
        <motion.div
          className="signup-login-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          Already have an account?
          <Link href="/auth/login">Login</Link>
        </motion.div>
      </form>
    </motion.div>
  );
}
