export const metadata = {
  title: `Dashboard`,
  description: "FilesDrive Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
