'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Mail, Lock, Eye, EyeOff, UserPlus, Loader2, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onLoginClick: () => void;
}

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const router = useRouter();
  const { register, verifyEmail, resendVerificationCode } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { formState } = form;
  const isLoading = formState.isSubmitting;

  const handleVerification = async () => {
    try {
      setError(null);
      await verifyEmail({
        email: userEmail,
        code: verificationCode,
        password: userPassword,
      });
      // User will be automatically signed in after verification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResendingCode(true);
      setError(null);
      await resendVerificationCode(userEmail);
      // Show success message or toast
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsResendingCode(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      const result = await register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      if (result.isVerificationRequired) {
        setUserEmail(result.email);
        setUserPassword(data.password);
        setIsVerifying(true);
      }
      // If not verification required, user is automatically signed in
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  if (isVerifying) {
    return (
      <Card className="w-full border-0 shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Check Your Email</CardTitle>
          <CardDescription className="text-center text-gray-600">
            We've sent a verification code to <span className="font-medium text-gray-900">{userEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-gray-700">Verification Code</Label>
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="h-11 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-center gap-2">
              <span>⚠</span>
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button 
            onClick={handleVerification}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
            disabled={!verificationCode.trim()}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify Email
          </Button>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleResendCode}
              disabled={isResendingCode}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {isResendingCode ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  Resend verification code
                </>
              )}
            </button>
            
            <button
              onClick={() => setIsVerifying(false)}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to registration
            </button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-900">Create Account</CardTitle>
        <CardDescription className="text-center text-gray-600">
          Join us and start your shopping journey
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-11"
                {...form.register("email")}
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠</span>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-10 pr-10 h-11"
                {...form.register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠</span>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10 h-11"
                {...form.register("confirmPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠</span>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-center gap-2">
              <span>⚠</span>
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign in here
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}