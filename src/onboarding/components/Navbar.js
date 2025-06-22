"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="flex items-center h-16">
        <h1 className="text-xl font-bold text-gray-900 ml-4">
          User Onboarding
        </h1>
        <ul className="flex items-center space-x-8">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ml-4 hover:bg-gray-100 ${
              pathName === "/" ? "bg-blue-100 text-blue-700" : "text-gray-500"
            }`}
            onClick={() => router.push("/")}
          >
            Home
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              pathName === "/admin"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => router.push("/admin")}
          >
            Admin
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              pathName === "/data"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => router.push("/data")}
          >
            Data
          </button>
        </ul>
      </div>
    </nav>
  );
}
