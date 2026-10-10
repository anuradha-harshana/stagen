import Image from "next/image"

export function RegisterPanel() {
  return (
    <div className="font-sans relative hidden h-full flex-col bg-white p-10 md:flex">
      <span className="text-6xl font-serif leading-none text-burning-flame">
        "
      </span>
      <p className="-mt-3 max-w-sm text-lg font-medium leading-relaxed text-blue-fantastic">
        Stagen helped us grow immensely over the past few months — handling
        the day-to-day platform work saved us a lot of issues and hassle.
      </p>
      <span className="mt-2 self-end text-6xl font-serif leading-none text-burning-flame">
        "
      </span>

      <div className="mt-3 flex items-center gap-3">
        <Image
          src="/images/user.jpg"
          alt=""
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-blue-fantastic">Sam Carter</p>
          <p className="text-xs text-blue-fantastic/60">CEO @ Build&Co</p>
        </div>
      </div>

      <div className="relative -mx-10 -mb-10 mt-auto h-56">
        <Image
          src="/images/building.png"
          alt=""
          fill
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}