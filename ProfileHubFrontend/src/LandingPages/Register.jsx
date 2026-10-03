import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  UserRound,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://profilehub-iudu.onrender.com";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function apiErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [touched, setTouched] = useState({});

  const [cooldown, setCooldown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const timerRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    timerRef.current = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const trimmedName = name.trim();

  const errors = useMemo(() => {
    const e = {};

    if (touched.name) {
      if (trimmedName.length === 0) {
        e.name = "Enter your full name";
      } else if (trimmedName.length < 2) {
        e.name = "Name is too short";
      } else if (trimmedName.length > 60) {
        e.name = "Name is too long";
      }
    }

    if (touched.email) {
      if (!email) {
        e.email = "Email is required";
      } else if (!isValidEmail(email)) {
        e.email = "Enter a valid email address";
      }
    }

    if (touched.password) {
      if (password.length === 0) {
        e.password = "Password is required";
      } else if (password.length < 8) {
        e.password = "Use at least 8 characters";
      }
    }

    if (
      touched.confirmPassword &&
      confirmPassword !== password
    ) {
      e.confirmPassword = "Passwords don't match";
    }

    if (touched.otp) {
      if (!otp) {
        e.otp = "Enter the code we sent you";
      } else if (otp.length !== 6) {
        e.otp = "Code must be 6 digits";
      }
    }

    return e;
  }, [
    trimmedName,
    email,
    password,
    confirmPassword,
    otp,
    touched,
  ]);

  const canSend =
    isValidEmail(email) &&
    cooldown === 0 &&
    !sendingCode;

  const canSubmit =
    trimmedName.length >= 2 &&
    trimmedName.length <= 60 &&
    isValidEmail(email) &&
    password.length >= 8 &&
    confirmPassword === password &&
    otp.length === 6;

  const handleSendCode = async () => {
    if (!canSend) return;

    setFormError("");
    setSendingCode(true);

    try {
      await axios.post(`${API_BASE_URL}/api/mailotp`, {
        email,
      });

      setCodeSent(true);
      setCooldown(60);
    } catch (error) {
      setFormError(
        apiErrorMessage(
          error,
          "Couldn't send the code. Try again."
        )
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      otp: true,
    });

    setFormError("");

    if (!canSubmit) return;

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        {
          name: trimmedName,
          email,
          password,
          otp,
        }
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      login(token);

      navigate("/");
    } catch (error) {
      setFormError(
        apiErrorMessage(
          error,
          "Registration failed. Check your details and try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href =
      `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">

        <div className="grid lg:grid-cols-2 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">

          {/* LEFT — PRODUCT INTRODUCTION */}
          <div className="hidden lg:flex flex-col justify-between bg-gray-50 p-12 xl:p-16 border-r border-gray-200">

            <div>
              {/* Brand */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-left"
              >
                <span className="text-2xl font-bold tracking-tight text-blue-600">
                  ProfileHub
                </span>
              </button>

              <div className="mt-16 max-w-lg">
                <p className="text-sm font-medium text-blue-600 mb-4">
                  JOIN PROFILEHUB
                </p>

                <h2 className="text-4xl xl:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
                  Create your professional presence.
                  <span className="block text-gray-500">
                    Make your work visible.
                  </span>
                </h2>

                <p className="mt-6 text-base leading-7 text-gray-600 max-w-md">
                  Create your ProfileHub account and bring your
                  professional identity together in one place.
                  Build your profile, showcase your experience,
                  share your work, and connect with others.
                </p>
              </div>

              {/* Features */}
              <div className="mt-10 space-y-5">

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0">
                    <UserRound size={18} className="text-gray-700" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Build your profile
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 leading-6">
                      Create a profile with your bio, skills,
                      education and experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0">
                    <BriefcaseBusiness
                      size={18}
                      className="text-gray-700"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Showcase your work
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 leading-6">
                      Share posts and keep your professional
                      activity organized.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0">
                    <Users size={18} className="text-gray-700" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Connect with developers
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 leading-6">
                      Build professional connections with people
                      in the developer community.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-xs text-gray-400 mt-10">
              ProfileHub · Your professional space
            </p>
          </div>

          {/* RIGHT — SIGNUP */}
          <div className="p-6 sm:p-10 lg:p-12 xl:p-14">

            {/* Mobile Brand */}
            <div className="lg:hidden mb-8">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-xl font-bold text-blue-600"
              >
                ProfileHub
              </button>
            </div>

            <div className="max-w-md mx-auto">

              <div className="mb-7">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Create your account
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Start building your professional profile on
                  ProfileHub.
                </p>
              </div>

              {/* Error */}
              {formError && (
                <div
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  role="alert"
                >
                  {formError}
                </div>
              )}

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full h-11 flex items-center justify-center gap-3
                           rounded-lg border border-gray-300
                           bg-white text-sm font-medium text-gray-700
                           hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.51A9.74 9.74 0 0 0 12 21.5Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.54 13.61A5.86 5.86 0 0 1 6.23 12c0-.56.11-1.1.31-1.61V7.88H3.29A9.5 9.5 0 0 0 2.5 12c0 1.49.36 2.9.99 4.12l3.05-2.51Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.05 2.51C7.31 8.08 9.46 6.36 12 6.36Z"
                  />
                </svg>

                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1.5 text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    onBlur={() =>
                      setTouched((current) => ({
                        ...current,
                        name: true,
                      }))
                    }
                    placeholder="Your full name"
                    className={`w-full h-11 px-3 rounded-lg border
                      bg-white text-sm text-gray-900 outline-none
                      transition-colors
                      ${
                        errors.name
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1.5 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setCodeSent(false);
                    }}
                    onBlur={() =>
                      setTouched((current) => ({
                        ...current,
                        email: true,
                      }))
                    }
                    placeholder="you@example.com"
                    className={`w-full h-11 px-3 rounded-lg border
                      bg-white text-sm text-gray-900 outline-none
                      transition-colors
                      ${
                        errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1.5 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      onBlur={() =>
                        setTouched((current) => ({
                          ...current,
                          password: true,
                        }))
                      }
                      placeholder="At least 8 characters"
                      className={`w-full h-11 px-3 pr-10 rounded-lg border
                        bg-white text-sm text-gray-900 outline-none
                        transition-colors
                        ${
                          errors.password
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-400 hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-1.5 text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      onBlur={() =>
                        setTouched((current) => ({
                          ...current,
                          confirmPassword: true,
                        }))
                      }
                      placeholder="Retype your password"
                      className={`w-full h-11 px-3 pr-10 rounded-lg border
                        bg-white text-sm text-gray-900 outline-none
                        transition-colors
                        ${
                          errors.confirmPassword
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-400 hover:text-gray-700"
                      aria-label={
                        showConfirm
                          ? "Hide password"
                          : "Show password"
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
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Verification code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="otp"
                      className="text-sm font-medium text-gray-700"
                    >
                      Verification code
                    </label>

                    {codeSent && (
                      <span className="text-xs text-green-600">
                        Code sent
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value.replace(/\D/g, "")
                        )
                      }
                      onBlur={() =>
                        setTouched((current) => ({
                          ...current,
                          otp: true,
                        }))
                      }
                      placeholder="000000"
                      className={`w-full h-11 px-3 rounded-lg border
                        bg-white text-sm text-gray-900 outline-none
                        tracking-[0.3em] transition-colors
                        ${
                          errors.otp
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!canSend}
                      className={`h-11 px-4 whitespace-nowrap rounded-lg
                        text-sm font-medium transition-colors
                        ${
                          canSend
                            ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "border border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {sendingCode
                        ? "Sending..."
                        : cooldown > 0
                        ? `Resend ${cooldown}s`
                        : codeSent
                        ? "Resend code"
                        : "Send code"}
                    </button>
                  </div>

                  {errors.otp && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className={`w-full h-11 rounded-lg flex items-center
                             justify-center gap-2 text-sm font-medium
                             transition-colors mt-2
                             ${
                               canSubmit && !submitting
                                 ? "bg-blue-600 text-white hover:bg-blue-700"
                                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
                             }`}
                >
                  {submitting ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already a member?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Log in
                </button>
              </p>

              <p className="mt-7 text-center text-xs text-gray-400">
                By continuing, you agree to ProfileHub's terms and
                policies.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}