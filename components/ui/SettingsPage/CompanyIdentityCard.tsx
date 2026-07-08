import React, { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Image as ImageIcon } from "lucide-react"

interface CompanyIdentityCardProps {
  logo: string
  logoName: string
  onLogoUpload: (logo: string, name: string) => void
  onResetLogo: () => void
}

export function CompanyIdentityCard({
  logo,
  logoName,
  onLogoUpload,
  onResetLogo,
}: CompanyIdentityCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Max size is 2MB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        onLogoUpload(reader.result as string, file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="border-2 border-[#eee9df]/50 shadow-sm rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#ffb162]/10 text-[#a35139]">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[#2c3b4d]">Company Identity</CardTitle>
            <CardDescription className="text-xs text-[#2c3b4d]/60">
              Upload your organization's logo for dashboards, invoices, and reports.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#c9c1b1]/15 border border-[#c9c1b1]/20">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white border border-[#c9c1b1]/30 shadow-inner flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#ffb162]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={logo} 
                alt="Company Logo Preview" 
                className="max-w-full max-h-full object-contain p-2"
              />
            </div>
          </div>
          
          <div className="flex-1 w-full text-center sm:text-left space-y-2">
            <div className="text-sm font-semibold text-[#2c3b4d] truncate">{logoName}</div>
            <div className="text-xs text-[#2c3b4d]/50">PNG, JPG or SVG. Max size 2MB.</div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Button 
                variant="outline"
                size="sm"
                className="rounded-xl border-[#2c3b4d]/20 text-[#2c3b4d] hover:bg-[#2c3b4d]/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload Logo
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                className="rounded-xl"
                onClick={onResetLogo}
                disabled={logo === "/images/logo.png"}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
