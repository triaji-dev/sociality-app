import { Navbar, MobileNav } from "@/components/layouts";
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
        <main className="flex-1 pt-16 md:pt-20 pb-20">
          <div className="container max-w-4xl mx-auto py-6 px-4">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <PostDetailModal />
    </div>
  );
}
