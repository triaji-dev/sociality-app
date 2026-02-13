import { Navbar, Sidebar, MobileNav } from "@/components/layouts";
import { PostDetailModal } from "@/components/posts/post-detail-modal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="container max-w-4xl py-6 px-4">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <PostDetailModal />
    </div>
  );
}
