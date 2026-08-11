import Image from "next/image"

export function BrandPanel() {
  return (
    <div className="font-cream relative hidden h-full bg-blue-fantastic md:block">
      <Image
        src="/images/building.png"
        alt=""
        fill
        className="object-cover object-bottom opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-fantastic via-blue-fantastic/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center gap-3 p-10">
        <h2 className="max-w-xs text-2xl font-semibold leading-snug text-white">
          Track every build, from foundation to handover.
        </h2>
        <p className="max-w-xs text-sm text-palladian/70">
          Real-time progress, client updates, and trade coordination in one place.
        </p>
      </div>
    </div>
  )
}