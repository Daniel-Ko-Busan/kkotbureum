import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminMobileNav from '@/components/layout/AdminMobileNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-secondary">
      <AdminSidebar />
      <div className="flex-1 md:ml-0">
        <main className="p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
