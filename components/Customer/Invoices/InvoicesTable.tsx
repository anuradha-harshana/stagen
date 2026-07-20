import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Download, FileText } from "lucide-react"

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Upcoming"

const INVOICES: {
  id: string
  description: string
  date: string
  due: string
  amount: string
  status: InvoiceStatus
}[] = [
  { id: "INV-001", description: "Deposit – Contract Signing",   date: "Apr 1, 2025",  due: "Apr 1, 2025",  amount: "$97,000",  status: "Paid" },
  { id: "INV-002", description: "Stage 1 – Foundation Complete",date: "May 15, 2025", due: "May 20, 2025", amount: "$72,750",  status: "Paid" },
  { id: "INV-003", description: "Stage 2 – Frame Complete",     date: "Jun 30, 2025", due: "Jul 5, 2025",  amount: "$48,500",  status: "Paid" },
  { id: "INV-004", description: "Stage 3 – Lock-up",            date: "Aug 12, 2025", due: "Aug 17, 2025", amount: "$97,000",  status: "Pending" },
  { id: "INV-005", description: "Stage 4 – Fixing Stage",       date: "Oct 1, 2025",  due: "Oct 6, 2025",  amount: "$97,000",  status: "Upcoming" },
  { id: "INV-006", description: "Stage 5 – Practical Completion",date:"Dec 1, 2025",  due: "Dec 6, 2025",  amount: "$72,750",  status: "Upcoming" },
]

const statusConfig: Record<InvoiceStatus, { badge: string; dot: string }> = {
  Paid:     { badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold", dot: "bg-truffle-trouble" },
  Pending:  { badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",   dot: "bg-burning-flame" },
  Overdue:  { badge: "bg-red-500/10 text-red-700 border-red-500/30 font-bold",                       dot: "bg-red-500" },
  Upcoming: { badge: "bg-blue-fantastic/5 text-blue-fantastic/70 border-blue-fantastic/20 font-bold",dot: "bg-blue-fantastic/30" },
}

export function InvoicesTable() {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-cream">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-blue-fantastic/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-fantastic" />
          </div>
          <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">Invoice History</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-3">
        <Table>
          <TableHeader>
            <TableRow className="border-blue-fantastic/10 hover:bg-transparent">
              <TableHead className="text-blue-fantastic/70 text-[11px] uppercase tracking-wider font-bold">Invoice</TableHead>
              <TableHead className="text-blue-fantastic/70 text-[11px] uppercase tracking-wider font-bold">Description</TableHead>
              <TableHead className="text-blue-fantastic/70 text-[11px] uppercase tracking-wider font-bold hidden sm:table-cell">Due</TableHead>
              <TableHead className="text-blue-fantastic/70 text-[11px] uppercase tracking-wider font-bold text-right">Amount</TableHead>
              <TableHead className="text-blue-fantastic/70 text-[11px] uppercase tracking-wider font-bold">Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => {
              const cfg = statusConfig[inv.status]
              return (
                <TableRow
                  key={inv.id}
                  className="border-blue-fantastic/10 hover:bg-blue-fantastic/5 transition-colors duration-150"
                >
                  <TableCell className="text-blue-fantastic/70 text-xs font-mono font-semibold">{inv.id}</TableCell>
                  <TableCell className="text-blue-fantastic text-xs max-w-[150px] truncate font-bold">{inv.description}</TableCell>
                  <TableCell className="text-blue-fantastic/70 text-xs font-semibold hidden sm:table-cell">{inv.due}</TableCell>
                  <TableCell className="text-blue-fantastic text-xs font-bold text-right tabular-nums">{inv.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      <Badge variant="outline" className={`text-xs border ${cfg.badge}`}>
                        {inv.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {inv.status === "Paid" && (
                      <Button variant="ghost" size="icon-xs" className="text-blue-fantastic/60 hover:text-truffle-trouble hover:bg-truffle-trouble/10">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {inv.status === "Pending" && (
                      <Button size="xs" className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-[10px] h-5 px-2.5 font-bold shadow-sm">
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
