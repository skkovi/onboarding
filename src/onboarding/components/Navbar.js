"use client";
import { useRouter } from "next/navigation";

export default function Navbar({ currentStep, onNext, onPrevious }) {
  const router = useRouter();
  return (
    <nav>
      <div>
        <ul className="flex justify-between items-center">
          <li onClick={() => router.push("/")}>Home</li>
          <li>
            <button onClick={() => router.push("/admin")}>Admin</button>
          </li>
          <li onClick={() => router.push("/data")}>Data</li>
        </ul>
      </div>
    </nav>
  );
}
