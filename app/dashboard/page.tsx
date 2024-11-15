import { UploadsHead } from "@/components/uploads-head";
import { UploadsTable } from "@/components/uploads-table";

export default function Dashboard() {
  return (
    <main className="flex flex-row items-center justify-between max-w-screen-2xl mx-auto">
      <div className="flex flex-col mx-auto mt-3 border border-muted-gray-100 bg-muted-gray-100 p-4 shadow-sm w-full">
        <UploadsHead />
        <UploadsTable />
      </div>
    </main>
  );
}
