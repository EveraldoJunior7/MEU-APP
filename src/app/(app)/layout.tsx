import { TopBar } from "@/components/app/TopBar";
import { BottomNav } from "@/components/app/BottomNav";
import { requireUser } from "@/controllers/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar email={user.email} />
      <main className="flex-1 mx-auto w-full max-w-md px-4 pt-5 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
