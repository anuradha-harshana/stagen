import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  FileText,
  Edit3,
  FileSpreadsheet,
  FileImage,
  ExternalLink,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CertificationModal } from "./CertificationModal";

export interface Certification {
  id: string;
  name: string;
  licenseNo: string;
  issuedDate: string;
  expiryDate: string;
  status: "VERIFIED" | "ACTIVE" | "EXPIRED" | "PENDING";
  fileName?: string;
}

interface QualificationsCertificationsProps {
  certifications: Certification[];
  onAddCert: (cert: Certification) => void;
  onEditCert: (cert: Certification) => void;
  onDeleteCert: (id: string) => void;
}

export function QualificationsCertifications({
  certifications,
  onAddCert,
  onEditCert,
  onDeleteCert,
}: QualificationsCertificationsProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    cert?: Certification | null;
  }>({
    isOpen: false,
    mode: "add",
    cert: null,
  });

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, mode: "add", cert: null });
  };

  const handleOpenEdit = (cert: Certification) => {
    setModalState({ isOpen: true, mode: "edit", cert });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: "add", cert: null });
  };

  const handleFormSubmit = (cert: Certification) => {
    if (modalState.mode === "add") {
      onAddCert(cert);
    } else {
      onEditCert(cert);
    }
  };

  return (
    <>
      <Card className="border-2 border-palladian bg-white shadow-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-4 border-b border-oatmeal/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffb162]/10 text-truffle-trouble">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-abyssal-blue">
                Qualifications & Certifications
              </CardTitle>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-fantastic/20 text-blue-fantastic hover:bg-[#ffb162]/10 hover:border-[#ffb162]/50 hover:text-truffle-trouble"
            onClick={handleOpenAdd}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="relative flex flex-col justify-between p-5 rounded-2xl border-2 border-oatmeal/20 bg-white transition-all hover:border-[#ffb162]/40 hover:shadow-sm"
              >
                {/* Actions Top Right */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 rounded-lg text-blue-fantastic/40 hover:text-blue-fantastic hover:bg-surface-inset/30 transition-colors"
                    title="Edit Certification"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCert(cert.id)}
                    className="p-1.5 rounded-lg text-truffle-trouble/40 hover:text-truffle-trouble hover:bg-truffle-trouble/10 transition-colors"
                    title="Delete Certification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="pr-16">
                    <h4 className="text-sm font-extrabold text-blue-fantastic leading-tight pr-4">
                      {cert.name}
                    </h4>
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.5 mt-2 rounded border uppercase ${
                        cert.status === "VERIFIED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : cert.status === "ACTIVE"
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : cert.status === "EXPIRED"
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-oatmeal/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold text-oatmeal uppercase">
                        License/Cert No.
                      </span>
                      <span className="text-xs font-bold text-blue-fantastic truncate">
                        {cert.licenseNo}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold text-oatmeal uppercase">
                        Issued Date
                      </span>
                      <span className="text-xs font-bold text-blue-fantastic truncate">
                        {cert.issuedDate}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold text-oatmeal uppercase">
                        Expiry Date
                      </span>
                      <span
                        className={`text-xs font-bold truncate ${
                          cert.expiryDate === "Expired" ||
                          (cert.expiryDate !== "Never Expires" &&
                            new Date(cert.expiryDate) < new Date())
                            ? "text-truffle-trouble"
                            : "text-blue-fantastic"
                        }`}
                      >
                        {cert.expiryDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attachment File Section */}
                {cert.fileName && (
                  <div className="mt-4 p-2.5 rounded-xl bg-surface-inset border border-oatmeal/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {cert.fileName.endsWith(".pdf") ? (
                        <FileText className="h-4 w-4 text-truffle-trouble shrink-0" />
                      ) : cert.fileName.endsWith(".xlsx") || cert.fileName.endsWith(".xls") ? (
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <FileImage className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-blue-fantastic truncate pr-1">
                        {cert.fileName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toast.success(`Simulating preview of ${cert.fileName}`)}
                        className="p-1 rounded-md text-blue-fantastic/50 hover:text-blue-fantastic hover:bg-white transition-colors"
                        title="View Document"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toast.success(`Simulating download of ${cert.fileName}`)}
                        className="p-1 rounded-md text-blue-fantastic/50 hover:text-blue-fantastic hover:bg-white transition-colors"
                        title="Download Document"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {certifications.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-oatmeal/40 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Briefcase className="h-8 w-8 text-oatmeal" />
                <p className="text-sm font-bold text-blue-fantastic">
                  No qualifications or certifications listed.
                </p>
                <p className="text-xs text-blue-fantastic/50">
                  Click "+ Add Certification" to record one.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Unified Add/Edit Certification Modal */}
      {modalState.isOpen && (
        <CertificationModal
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          initialData={modalState.cert}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  );
}
