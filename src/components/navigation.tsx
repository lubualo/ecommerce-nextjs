'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ShoppingCart, User, LogOut, LogIn, UserPlus } from 'lucide-react';

export function Navigation() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <button 
              onClick={() => router.push('/')}
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              E-commerce
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/products')}
              className="flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Products</span>
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => logout()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/login')}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
                <Button 
                  onClick={() => router.push('/register')}
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
