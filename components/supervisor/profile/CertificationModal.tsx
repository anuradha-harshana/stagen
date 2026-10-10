import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Certification } from "./QualificationsCertifications";
import { ProfileFormField } from "./ProfileFormField";

interface CertificationModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: Certification | null;
  onClose: () => void;
  onSubmit: (cert: Certification) => void;
}

const certSchema = z
  .object({
    name: z.string().min(1, "Certification Name is required."),
    licenseNo: z.string().min(1, "License/Cert No. is required."),
    issuedDate: z.string().min(1, "Issued Date is required."),
    expiryDate: z.string().optional(),
    neverExpires: z.boolean(),
    status: z.enum(["ACTIVE", "VERIFIED", "PENDING", "EXPIRED"]),
    fileName: z.string().optional(),
  })
  .refine(
    (data) => data.neverExpires || Boolean(data.expiryDate && data.expiryDate.trim().length > 0),
    {
      message: "Specify an Expiry Date or check 'Never Expires'.",
      path: ["expiryDate"],
    }
  );

type CertFormData = z.infer<typeof certSchema>;

export function CertificationModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: CertificationModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CertFormData>({
    resolver: zodResolver(certSchema),
    defaultValues: {
      name: initialData?.name || "",
      licenseNo: initialData?.licenseNo || "",
      issuedDate: initialData?.issuedDate || "",
      expiryDate: initialData?.expiryDate === "Never Expires" ? "" : initialData?.expiryDate || "",
      neverExpires: initialData?.expiryDate === "Never Expires",
      status: initialData?.status || "ACTIVE",
      fileName: initialData?.fileName || "",
    },
  });

  const neverExpires = watch("neverExpires");
  const fileName = watch("fileName");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".docx", ".xlsx"];
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const isAllowed =
        allowedExtensions.includes(fileExt) ||
        file.type.startsWith("image/") ||
        file.type === "application/pdf";

      if (!isAllowed) {
        toast.error("Invalid document format. Allowed formats: PDF, Word, Excel, PNG, JPG.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Document is too large. Max size is 10MB.");
        return;
      }

      setValue("fileName", file.name);
      toast.success(`Attached ${file.name} successfully.`);
    }
  };

  const handleFormSubmit = (data: CertFormData) => {
    const expiry = data.neverExpires ? "Never Expires" : data.expiryDate || "";
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      name: data.name,
      licenseNo: data.licenseNo,
      issuedDate: data.issuedDate,
      expiryDate: expiry,
      status: data.status,
      fileName: data.fileName || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyssal-blue/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-oatmeal/30 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-oatmeal/10 bg-surface-inset">
          <h3 className="font-bold text-blue-fantastic text-base">
            {mode === "add" ? "Add Certification / Qualification" : "Edit Certification"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-oatmeal/20 text-blue-fantastic/60 hover:text-blue-fantastic transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ProfileFormField
                label="Certification Name"
                required
                placeholder="e.g. CPR & First Aid Induction"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>
            <ProfileFormField
              label="License/Cert No."
              required
              placeholder="e.g. FA-998877"
              error={errors.licenseNo?.message}
              {...register("licenseNo")}
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Status</label>
              <select
                className="px-3.5 py-2 text-sm bg-white border-2 border-oatmeal/35 rounded-2xl text-blue-fantastic focus:border-[#ffb162] outline-none transition-all font-sans font-medium"
                {...register("status")}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="PENDING">PENDING</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
            <ProfileFormField
              label="Issued Date"
              required
              type="date"
              error={errors.issuedDate?.message}
              {...register("issuedDate")}
            />
            <ProfileFormField
              label="Expiry Date"
              type="date"
              disabled={neverExpires}
              error={errors.expiryDate?.message}
              {...register("expiryDate")}
            />
            <div className="flex items-center gap-2 sm:col-span-2 pt-1">
              <input
                type="checkbox"
                id="neverExpires"
                className="h-4.5 w-4.5 rounded border-oatmeal bg-white text-blue-fantastic focus:ring-0 cursor-pointer"
                {...register("neverExpires")}
              />
              <label htmlFor="neverExpires" className="text-xs font-bold text-blue-fantastic cursor-pointer">
                This certification does not expire
              </label>
            </div>

            {/* Document Upload */}
            <div className="flex flex-col gap-1.5 sm:col-span-2 pt-2 border-t border-oatmeal/10">
              <label className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">
                Upload Certificate / Card Copy (Optional)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-oatmeal/40 text-blue-fantastic hover:bg-surface-inset/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  {fileName ? "Change Document" : "Browse Document"}
                </Button>
                {fileName ? (
                  <span className="text-xs font-bold text-blue-fantastic truncate max-w-[200px]">
                    {fileName}
                  </span>
                ) : (
                  <span className="text-[11px] text-blue-fantastic/50">PDF, PNG, JPG, Word (Max 10MB)</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-oatmeal/50 text-blue-fantastic"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-fantastic text-white hover:bg-blue-fantastic/90 rounded-2xl"
            >
              {mode === "add" ? "Add Certification" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
