import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-4">
      <Button variant="default">
        <Link href="/register">Register</Link>
      </Button>
      <Button variant="outline">
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}
