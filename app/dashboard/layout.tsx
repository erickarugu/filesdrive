import { MainNav } from "@/components/main-nav";

async function getRandomPerson(): Promise<{
  name: {
    first: string;
    last: string;
  };
}> {
  const res = await fetch("https://randomuser.me/api");
  const data = await res.json();
  return data.results[0];
}

export const metadata = {
  title: `Dashboard`,
  description: "Dashboard for the app",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainNav />
      {children}
    </>
  );
}
