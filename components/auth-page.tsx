"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<"user" | "admin">("user")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qRole = searchParams?.get("role")
    if (qRole === "admin") {
      setRole("admin")
      setIsLogin(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (role === "admin") {
      // Admin can only log in (no register)
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (email === "admin@candora.com" && password === "123456789") {
        const token = btoa(
          JSON.stringify({
            email,
            role: "admin",
            exp: Date.now() + 24 * 60 * 60 * 1000,
          }),
        )
        localStorage.setItem("adminToken", token)
        router.push("/admin/dashboard")
      } else {
        setError("Invalid admin credentials. Use admin@candora.com / 123456789")
      }
    } else {
      // Simulate user authentication process
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.push("/showcase")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl font-bold text-gray-900">
              {role === "admin" ? "Admin Sign In" : isLogin ? "Welcome Back to Sweet Shop" : "Join the Sweet Community"}
            </h1>
            <p className="text-gray-600 font-sans">
              {role === "admin"
                ? "Sign in with your admin credentials"
                : isLogin
                  ? "Let's get started with your 30 days trial"
                  : "Create your account to explore our sweets"}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant={role === "user" ? "default" : "outline"}
              onClick={() => {
                setRole("user")
                // user can toggle login/register freely
              }}
            >
              User
            </Button>
            <Button
              type="button"
              variant={role === "admin" ? "default" : "outline"}
              onClick={() => {
                setRole("admin")
                // force login mode for admin; admin cannot register
                setIsLogin(true)
              }}
            >
              Admin
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && role === "user" && (
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 px-4 text-base border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                  autoComplete="name"
                  required
                />
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-4 text-base border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 px-4 pr-12 text-base border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-gray-500 hover:text-rose-600 font-sans">
                  Recovery Password
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-rose-200 disabled:opacity-50"
            >
              {isLoading ? "Please wait..." : role === "admin" ? "Sign In" : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          {/* Social login removed as requested */}

          {role === "user" && (
            <div className="text-center">
              <p className="text-gray-600 font-sans">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-rose-600 hover:text-rose-700 font-semibold">
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Sweet Shop Illustration */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-orange-200 via-rose-200 to-amber-100">
        <SweetShopIllustration />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="font-display text-2xl font-bold mb-2">Finally, You Are Here!</h2>
          <div className="flex space-x-2">
            <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SweetShopIllustration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover"
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Gradient */}
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="50%" stopColor="#FECACA" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
        <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>

      <rect width="400" height="600" fill="url(#bg-gradient)" />

      {/* Sun */}
      <circle cx="320" cy="80" r="40" fill="url(#sun-gradient)" opacity="0.8" />

      {/* Sweet Shop Display Counter */}
      <rect x="50" y="400" width="300" height="120" rx="15" fill="#8B4513" />
      <rect x="60" y="390" width="280" height="20" rx="10" fill="#A0522D" />

      {/* Glass Display Cases */}
      <rect x="70" y="350" width="80" height="60" rx="8" fill="#E5E7EB" opacity="0.3" />
      <rect x="170" y="350" width="80" height="60" rx="8" fill="#E5E7EB" opacity="0.3" />
      <rect x="270" y="350" width="80" height="60" rx="8" fill="#E5E7EB" opacity="0.3" />

      {/* Laddus */}
      <circle cx="90" cy="370" r="8" fill="#F59E0B" />
      <circle cx="110" cy="375" r="8" fill="#F59E0B" />
      <circle cx="130" cy="370" r="8" fill="#F59E0B" />

      {/* Jalebi Swirls */}
      <path
        d="M180 365 Q190 355 200 365 Q210 375 220 365 Q230 355 240 365"
        stroke="#F97316"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M185 375 Q195 365 205 375 Q215 385 225 375 Q235 365 245 375"
        stroke="#F97316"
        strokeWidth="4"
        fill="none"
      />

      {/* Mithai Squares */}
      <rect x="280" y="365" width="12" height="12" rx="2" fill="#EC4899" />
      <rect x="295" y="365" width="12" height="12" rx="2" fill="#10B981" />
      <rect x="310" y="365" width="12" height="12" rx="2" fill="#F59E0B" />
      <rect x="325" y="365" width="12" height="12" rx="2" fill="#8B5CF6" />

      {/* Decorative Elements */}
      <circle cx="100" cy="200" r="30" fill="#FECACA" opacity="0.6" />
      <circle cx="300" cy="250" r="25" fill="#FEF3C7" opacity="0.6" />
      <circle cx="150" cy="150" r="20" fill="#DBEAFE" opacity="0.6" />

      {/* Sweet Shop Sign */}
      <rect x="120" y="280" width="160" height="40" rx="20" fill="#8B4513" />
      <text x="200" y="305" textAnchor="middle" fill="#FEF3C7" fontSize="16" fontFamily="serif">
        Sweet Shop
      </text>

      {/* Decorative Swirls */}
      <path d="M80 120 Q100 100 120 120 Q140 140 160 120" stroke="#F97316" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M240 180 Q260 160 280 180 Q300 200 320 180" stroke="#EC4899" strokeWidth="2" fill="none" opacity="0.7" />
    </svg>
  )
}
