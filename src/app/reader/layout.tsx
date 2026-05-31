// app/reader/layout.tsx

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#E0F2FE] text-gray-900 min-h-screen">
      {children}
    </div>
  );
}
