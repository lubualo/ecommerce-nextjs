'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full">
      {isLogin ? (
        <LoginForm onRegisterClick={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onLoginClick={() => setIsLogin(true)} />
      )}
    </div>
  );
}