import Image from "next/image"
import Link from "next/link"

export function AuthLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <Image 
        src="/images/logo.png" 
        alt="" 
        width={24} 
        height={24}
        className="scale-[3]" 
      />
    </Link>
  )
}