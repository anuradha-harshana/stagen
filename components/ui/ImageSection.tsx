
import Image from "next/image";

export default function ImageSection() {
  return (
    <div className="relative hidden lg:block h-screen">

      <Image
        src="/backgroundHouse.png"
        alt="House"
        fill
        priority
        sizes="(max-width: 1024px) 90vw, 50vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F2]/95 to-transparent" />

      <div className="absolute left-12 top-24 z-20 max-w-md">

        <div className="mb-8 rounded-full border bg-white px-4 py-2 w-fit">
          Trusted by builders
        </div>

        <h2 className="text-5xl font-bold">
          Building better
          <br />
          homes,
          <span className="text-orange-500">
            together.
          </span>
        </h2>

        <p className="mt-6 text-gray-600">
          BuildTrack connects builders and customers with
          real-time updates and communication.
        </p>

      </div>

    </div>
  );
}