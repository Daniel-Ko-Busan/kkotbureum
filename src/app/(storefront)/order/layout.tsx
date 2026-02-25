export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-lg mx-auto min-h-screen pb-10">
      {children}
    </main>
  );
}
