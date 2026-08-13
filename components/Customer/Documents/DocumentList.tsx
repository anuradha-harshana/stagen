import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, FileSpreadsheet, FileImage, ArrowUpRight } from "lucide-react"

const DOCUMENTS = [
  { id: 1, name: "Building Contract.pdf", type: "pdf", size: "2.4 MB", date: "Apr 1, 2025", category: "Contract" },
  { id: 2, name: "Floor Plan - Rev 3.pdf", type: "pdf", size: "5.1 MB", date: "Apr 12, 2025", category: "Plans" },
  { id: 3, name: "Inspection Report - June.pdf", type: "pdf", size: "1.2 MB", date: "Jun 28, 2025", category: "Report" },
  { id: 4, name: "Variation Order #1.pdf", type: "pdf", size: "0.8 MB", date: "Jul 10, 2025", category: "Variation" },
  { id: 5, name: "Schedule of Works.xlsx", type: "xlsx", size: "320 KB", date: "Apr 1, 2025", category: "Schedule" },
]

const categoryConfig: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  Contract: { bg: "bg-blue-fantastic/10", text: "text-blue-fantastic font-bold", border: "border-blue-fantastic/30", iconBg: "bg-blue-fantastic/15 border border-blue-fantastic/20" },
  Plans:    { bg: "bg-burning-flame/15", text: "text-truffle-trouble font-bold", border: "border-burning-flame/30", iconBg: "bg-burning-flame/20 border border-burning-flame/20" },
  Report:   { bg: "bg-truffle-trouble/10", text: "text-truffle-trouble font-bold", border: "border-truffle-trouble/30", iconBg: "bg-truffle-trouble/15 border border-truffle-trouble/20" },
  Variation:{ bg: "bg-blue-fantastic/5", text: "text-blue-fantastic/80 font-bold", border: "border-blue-fantastic/20", iconBg: "bg-blue-fantastic/10 border border-blue-fantastic/10" },
  Schedule: { bg: "bg-burning-flame/15", text: "text-truffle-trouble font-bold", border: "border-burning-flame/30", iconBg: "bg-burning-flame/20 border border-burning-flame/20" },
}

function FileIcon({ type, category }: { type: string; category: string }) {
  const cfg = categoryConfig[category]
  const Icon = type === "xlsx" ? FileSpreadsheet : type === "jpg" || type === "png" ? FileImage : FileText
  return (
    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${cfg?.iconBg ?? "bg-blue-fantastic/10"}`}>
      <Icon className={`h-5 w-5 ${cfg?.text?.split(" ")[0] ?? "text-blue-fantastic"}`} />
    </div>
  )
}

export function DocumentList() {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">Project Documents</CardTitle>
          <Badge
            variant="outline"
            className="ml-auto text-xs text-blue-fantastic/70 border-blue-fantastic/20 bg-blue-fantastic/5 font-semibold"
          >
            {DOCUMENTS.length} files
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-1.5">
          {DOCUMENTS.map((doc) => {
            const cfg = categoryConfig[doc.category]
            return (
              <div
                key={doc.id}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-transparent hover:bg-blue-fantastic/5 hover:border-blue-fantastic/15 transition-all duration-200 cursor-pointer"
              >
                <FileIcon type={doc.type} category={doc.category} />
                <div className="flex-1 min-w-0">
                  <p className="text-blue-fantastic text-sm font-bold truncate group-hover:text-truffle-trouble transition-colors">
                    {doc.name}
                  </p>
                  <p className="text-blue-fantastic/60 text-xs mt-0.5 font-medium">
                    {doc.size} · {doc.date}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs border hidden sm:inline-flex ${cfg?.bg} ${cfg?.text} ${cfg?.border}`}
                >
                  {doc.category}
                </Badge>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="icon-xs" className="text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/10">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-xs" className="text-blue-fantastic/60 hover:text-truffle-trouble hover:bg-truffle-trouble/10">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-blue-fantastic/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
