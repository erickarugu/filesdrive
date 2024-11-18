import { MainNavClient } from "@/components/mainNav";

export const metadata = {
  title: `Dashboard`,
  description: "Dashboard for the app",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
