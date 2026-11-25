import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-latin text-7xl text-gold">404</p>
      <h1 className="font-display text-3xl">هذه الصفحة غير موجودة</h1>
      <Link href="/" className="btn-gold rounded-full px-8 py-3 font-bold">
        العودة إلى المجموعة
      </Link>
    </main>
  );
}
