import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ZoomIn, CalendarDays } from "lucide-react"

const PHOTOS = [
  { id: 1, label: "Foundation Work", date: "Jun 10, 2025", stage: "Foundation", gradient: "from-blue-fantastic/40 to-abyssal-blue/80" },
  { id: 2, label: "Framing Complete", date: "Jul 2, 2025", stage: "Framing", gradient: "from-burning-flame/30 to-abyssal-blue/80" },
  { id: 3, label: "Roof Installation", date: "Jul 15, 2025", stage: "Roofing", gradient: "from-truffle-trouble/40 to-abyssal-blue/80" },
  { id: 4, label: "Electrical Rough-in", date: "Aug 1, 2025", stage: "Electrical", gradient: "from-blue-fantastic/30 to-abyssal-blue/70" },
  { id: 5, label: "Insulation", date: "Aug 20, 2025", stage: "Insulation", gradient: "from-burning-flame/30 to-truffle-trouble/40" },
  { id: 6, label: "Drywall Hanging", date: "Sep 5, 2025", stage: "Interior", gradient: "from-blue-fantastic/30 to-truffle-trouble/30" },
]

const stageColors: Record<string, string> = {
  Foundation: "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/30 font-semibold",
  Framing: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-semibold",
  Roofing: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-semibold",
  Electrical: "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/20 font-semibold",
  Insulation: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-semibold",
  Interior: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-semibold",
}

export function PhotoGrid() {
  return (
    <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-blue-fantastic/10 flex items-center justify-center">
            <Camera className="h-4 w-4 text-blue-fantastic" />
          </div>
          <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">Site Photos</CardTitle>
          <Badge
            variant="outline"
            className="ml-auto text-xs text-blue-fantastic/70 border-blue-fantastic/20 bg-blue-fantastic/5 font-semibold"
          >
            {PHOTOS.length} photos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer border border-blue-fantastic/15 hover:border-truffle-trouble/50 hover:shadow-md transition-all duration-300"
            >
              {/* gradient placeholder standing in for a real image */}
              <div className={`absolute inset-0 bg-gradient-to-br ${photo.gradient}`} />
              {/* subtle grid texture */}
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, #ffb162 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

              {/* center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-8 w-8 text-palladian/35" />
              </div>

              {/* hover overlay */}
              <div className="absolute inset-0 bg-abyssal-blue/0 group-hover:bg-abyssal-blue/60 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1">
                  <div className="h-8 w-8 rounded-full bg-surface-inset backdrop-blur-sm flex items-center justify-center border border-palladian/30">
                    <ZoomIn className="h-4 w-4 text-palladian" />
                  </div>
                  <span className="text-palladian text-[10px] font-semibold">View</span>
                </div>
              </div>

              {/* bottom label */}
              <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-abyssal-blue/95 via-abyssal-blue/65 to-transparent">
                <p className="text-palladian text-xs font-bold leading-tight truncate font-sans">{photo.label}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <CalendarDays className="h-2.5 w-2.5 text-oatmeal" />
                  <p className="text-oatmeal text-[10px] font-medium">{photo.date}</p>
                </div>
              </div>

              {/* top-right stage badge */}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full border backdrop-blur-sm bg-white/90 ${stageColors[photo.stage]}`}>
                  {photo.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
