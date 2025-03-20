"use client";

import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdminAuthenticated } from "@/app/api/authApi";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  
  // Chỉ chạy ở client-side
  useEffect(() => {
    setIsClient(true);
    
    // Kiểm tra xem có phải trang login không
    const isLoginPage = pathname === "/admin/login";
    
    // Nếu không phải trang login, kiểm tra xác thực
    if (!isLoginPage) {
      const checkAuth = async () => {
        const isAuthenticated = isAdminAuthenticated();
        if (!isAuthenticated) {
          redirect("/admin/login");
        }
      };
      
      checkAuth();
    }
  }, [pathname]);
  
  // Nếu là trang login, không hiển thị sidebar
  const isLoginPage = pathname === "/admin/login";
  
  if (!isClient) return null; // Tránh hydration mismatch
  
  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        <div>{children}</div>
      ) : (
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </AdminAuthProvider>
  );
}