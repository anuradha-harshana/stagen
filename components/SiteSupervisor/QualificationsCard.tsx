"use client";

import React, { useState, useEffect } from "react";
import { Certification, SupervisorProfile } from "@/lib/types/profile";
import { Edit2, X, FileText, Trash2, Plus, Briefcase, Check, Upload } from "lucide-react";

interface QualificationsCardProps {
  profile: SupervisorProfile;
  onUpdateProfile: (updated: Partial<SupervisorProfile>) => void;
}

export default function QualificationsCard({ profile, onUpdateProfile }: QualificationsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [addErrors, setAddErrors] = useState<{ [key: string]: string }>({});

  // State for the new certification form
  const [newCert, setNewCert] = useState<Omit<Certification, "id">>({
    name: "",
    status: "Pending",
    number: "",
    issuedDate: "",
    expiryDate: "",
    fileName: "",
    fileUrl: "",
  });

  const handleDeleteCert = (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      const updatedCerts = profile.certifications.filter((cert) => cert.id !== id);
      onUpdateProfile({ certifications: updatedCerts });
    }
  };

  const handleSaveCertEdit = (updatedCert: Certification) => {
    const updatedCerts = profile.certifications.map((c) => 
      c.id === updatedCert.id ? updatedCert : c
    );
    onUpdateProfile({ certifications: updatedCerts });
    setEditingCertId(null);
  };

  const validateAddForm = () => {
    const errors: { [key: string]: string } = {};
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const expiryRegex = /^(\d{4}-\d{2}-\d{2}|never|never expires)$/i;

    // Name Validation
    if (!newCert.name.trim()) {
      errors.name = "Certification Name is required";
    } else if (newCert.name.trim().length < 2) {
      errors.name = "Certification Name must be at least 2 characters";
    }

    // License/Cert No. Validation (optional, but validates if entered)
    if (newCert.number && newCert.number.trim().length < 3) {
      errors.number = "License/Cert No. must be at least 3 characters";
    }

    // Issued Date Validation
    if (!newCert.issuedDate || !newCert.issuedDate.trim()) {
      errors.issuedDate = "Issued Date is required";
    } else if (!dateRegex.test(newCert.issuedDate.trim())) {
      errors.issuedDate = "Must match format 'YYYY-MM-DD' (e.g. 2026-06-22)";
    }

    // Expiry Date Validation
    if (!newCert.expiryDate || !newCert.expiryDate.trim()) {
      errors.expiryDate = "Expiry Date is required";
    } else if (!expiryRegex.test(newCert.expiryDate.trim())) {
      errors.expiryDate = "Must match format 'YYYY-MM-DD' or 'Never'";
    }

    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddForm()) {
      const addedCert: Certification = {
        ...newCert,
        id: `cert-${Date.now()}`,
      };

      onUpdateProfile({
        certifications: [...profile.certifications, addedCert],
      });

      setIsAdding(false);
      setAddErrors({});
      // Reset form
      setNewCert({
        name: "",
        status: "Pending",
        number: "",
        issuedDate: "",
        expiryDate: "",
        fileName: "",
        fileUrl: "",
      });
    }
  };

  const handleNewCertChange = (field: keyof Omit<Certification, "id">, value: string) => {
    setNewCert((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error dynamically as the user types
    if (addErrors[field]) {
      setAddErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Handle uploading and converting document to Base64 (for the Add Modal)
  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert("File size exceeds the 1.5MB limit. Please upload a smaller document.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewCert((prev) => ({
        ...prev,
        fileName: file.name,
        fileUrl: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-oatmeal/30 flex flex-col gap-6 transition-all duration-200 hover:shadow-md">
      {/* Card Header */}
      <div className="flex justify-between items-center border-b border-oatmeal/30 pb-4">
        <h3 className="text-lg font-bold text-abyssal-blue flex items-center gap-2">
          <Briefcase size={20} className="text-blue-fantastic" />
          Qualifications & Certifications
        </h3>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-fantastic px-3 py-1.5 rounded bg-oatmeal/20 hover:bg-oatmeal hover:text-abyssal-blue transition-all"
          onClick={() => {
            setAddErrors({});
            setIsAdding(true);
          }}
        >
          <Plus size={12} />
          Add Certification
        </button>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.certifications.length > 0 ? (
          profile.certifications.map((cert) => (
            <CertificationItem
              key={cert.id}
              cert={cert}
              isEditing={editingCertId === cert.id}
              onStartEdit={() => setEditingCertId(cert.id)}
              onCancelEdit={() => setEditingCertId(null)}
              onSave={handleSaveCertEdit}
              onDelete={() => handleDeleteCert(cert.id)}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-oatmeal text-sm italic">
            No certifications listed. Click "Add Certification" to add new qualifications.
          </div>
        )}
      </div>

      {/* Modal for adding a single new certification */}
      {isAdding && (
        <div
          className="fixed inset-0 bg-abyssal-blue/50 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsAdding(false)}
        >
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-2xl p-6 w-[500px] max-w-[95%] shadow-xl border border-oatmeal flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-abyssal-blue border-b border-oatmeal/30 pb-2 flex items-center gap-2">
              <Plus size={18} className="text-truffle-trouble" />
              Add New Certification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-blue-fantastic">Certification Name</label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => handleNewCertChange("name", e.target.value)}
                  placeholder="e.g., First Aid Level II"
                  className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                    addErrors.name
                      ? "border-truffle-trouble focus:border-truffle-trouble"
                      : "border-oatmeal focus:border-burning-flame"
                  }`}
                />
                {addErrors.name && (
                  <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{addErrors.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-fantastic">Status</label>
                <select
                  value={newCert.status}
                  onChange={(e) =>
                    handleNewCertChange("status", e.target.value as Certification["status"])
                  }
                  className="w-full px-3 py-2 rounded border border-oatmeal text-sm bg-palladian/30 focus:outline-none focus:border-burning-flame focus:bg-white transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-fantastic">License/Cert No.</label>
                <input
                  type="text"
                  value={newCert.number || ""}
                  onChange={(e) => handleNewCertChange("number", e.target.value)}
                  placeholder="e.g. FA-992384"
                  className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                    addErrors.number
                      ? "border-truffle-trouble focus:border-truffle-trouble"
                      : "border-oatmeal focus:border-burning-flame"
                  }`}
                />
                {addErrors.number && (
                  <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{addErrors.number}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-fantastic">Issued Date</label>
                <input
                  type="text"
                  value={newCert.issuedDate || ""}
                  onChange={(e) => handleNewCertChange("issuedDate", e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                    addErrors.issuedDate
                      ? "border-truffle-trouble focus:border-truffle-trouble"
                      : "border-oatmeal focus:border-burning-flame"
                  }`}
                />
                {addErrors.issuedDate && (
                  <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{addErrors.issuedDate}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-blue-fantastic">Expiry Date</label>
                <input
                  type="text"
                  value={newCert.expiryDate || ""}
                  onChange={(e) => handleNewCertChange("expiryDate", e.target.value)}
                  placeholder="YYYY-MM-DD or Never"
                  className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                    addErrors.expiryDate
                      ? "border-truffle-trouble focus:border-truffle-trouble"
                      : "border-oatmeal focus:border-burning-flame"
                  }`}
                />
                {addErrors.expiryDate && (
                  <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{addErrors.expiryDate}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Upload Certificate Document</label>
              {newCert.fileName ? (
                <div className="flex items-center justify-between bg-oatmeal/10 border border-oatmeal/30 rounded px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-blue-fantastic font-medium min-w-0">
                    <FileText size={14} className="text-truffle-trouble shrink-0" />
                    <span className="truncate">{newCert.fileName}</span>
                  </div>
                  <button
                    type="button"
                    className="text-truffle-trouble p-1 rounded hover:bg-truffle-trouble/10"
                    onClick={() => {
                      setNewCert((prev) => ({ ...prev, fileName: "", fileUrl: "" }));
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    id="add-file-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleAddFileChange}
                  />
                  <label
                    htmlFor="add-file-input"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-oatmeal/50 hover:border-burning-flame hover:bg-burning-flame/5 rounded-lg p-4 text-center cursor-pointer transition-all duration-200"
                  >
                    <Upload size={20} className="text-oatmeal mb-1" />
                    <span className="text-xs font-semibold text-blue-fantastic">Click to upload document</span>
                    <span className="text-[10px] text-oatmeal">PDF, PNG, or JPG (max 1.5MB)</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-2 border-t border-oatmeal/20 pt-4">
              <button
                type="button"
                className="px-4 py-2 rounded border border-oatmeal text-xs font-semibold text-blue-fantastic hover:bg-oatmeal/20 transition-all flex items-center gap-1.5"
                onClick={() => setIsAdding(false)}
              >
                <X size={14} />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-burning-flame text-xs font-bold text-abyssal-blue hover:bg-[#ffa447] transition-all flex items-center gap-1.5"
              >
                <Check size={14} />
                Add Certification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Subcomponent for rendering individual certification items (handles its own display/edit states)
interface CertificationItemProps {
  cert: Certification;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updatedCert: Certification) => void;
  onDelete: () => void;
}

function CertificationItem({
  cert,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: CertificationItemProps) {
  const [formData, setFormData] = useState<Certification>({ ...cert });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync state and clear errors when the item switches to editing mode
  useEffect(() => {
    if (isEditing) {
      setFormData({ ...cert });
      setErrors({});
    }
  }, [isEditing, cert]);

  const handleInputChange = (field: keyof Certification, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error dynamically as the user types
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert("File size exceeds the 1.5MB limit. Please upload a smaller document.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleInputChange("fileName", file.name);
      handleInputChange("fileUrl", base64String);
    };
    reader.readAsDataURL(file);
  };

  const validateEditForm = () => {
    const editErrors: { [key: string]: string } = {};
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const expiryRegex = /^(\d{4}-\d{2}-\d{2}|never|never expires)$/i;

    // Name Validation
    if (!formData.name.trim()) {
      editErrors.name = "Certification Name is required";
    } else if (formData.name.trim().length < 2) {
      editErrors.name = "Certification Name must be at least 2 characters";
    }

    // License/Cert No. Validation (optional, but validates if entered)
    if (formData.number && formData.number.trim().length < 3) {
      editErrors.number = "License/Cert No. must be at least 3 characters";
    }

    // Issued Date Validation
    if (!formData.issuedDate || !formData.issuedDate.trim()) {
      editErrors.issuedDate = "Issued Date is required";
    } else if (!dateRegex.test(formData.issuedDate.trim())) {
      editErrors.issuedDate = "Must match format 'YYYY-MM-DD' (e.g. 2026-06-22)";
    }

    // Expiry Date Validation
    if (!formData.expiryDate || !formData.expiryDate.trim()) {
      editErrors.expiryDate = "Expiry Date is required";
    } else if (!expiryRegex.test(formData.expiryDate.trim())) {
      editErrors.expiryDate = "Must match format 'YYYY-MM-DD' or 'Never'";
    }

    setErrors(editErrors);
    return Object.keys(editErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEditForm()) {
      onSave(formData);
    }
  };

  const handleViewAttachment = () => {
    if (cert.fileUrl) {
      try {
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(
            `<iframe src="${cert.fileUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
          );
        } else {
          const link = document.createElement("a");
          link.href = cert.fileUrl;
          link.download = cert.fileName || "certification-document";
          link.click();
        }
      } catch (e) {
        const link = document.createElement("a");
        link.href = cert.fileUrl;
        link.download = cert.fileName || "certification-document";
        link.click();
      }
    } else {
      const dummyPdfContent = `%PDF-1.4\n1 0 obj\n<< /Title (${cert.name}) /Author (STAGEN) >>\nendobj\n% Mock PDF content for verification.`;
      const blob = new Blob([dummyPdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cert.fileName || `${cert.name.toLowerCase().replace(/ /g, "_")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusBadgeClass = (status: Certification["status"]) => {
    const base = "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider";
    switch (status) {
      case "Active":
      case "Verified":
        return `${base} bg-green-500/10 text-green-600`;
      case "Pending":
        return `${base} bg-burning-flame/15 text-truffle-trouble`;
      case "Expired":
        return `${base} bg-truffle-trouble/10 text-truffle-trouble`;
      default:
        return base;
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleFormSubmit}
        className="bg-palladian/30 border border-oatmeal/50 rounded-xl p-5 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]"
      >
        <div className="flex justify-between items-center border-b border-oatmeal/20 pb-2">
          <span className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            Edit Certification
          </span>
          <button
            type="button"
            className="text-truffle-trouble p-1 rounded hover:bg-truffle-trouble/10"
            onClick={onDelete}
            title="Delete Certification"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-[11px] font-semibold text-blue-fantastic">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-2 py-1.5 rounded border text-xs bg-white focus:outline-none transition-all ${
                errors.name ? "border-truffle-trouble focus:border-truffle-trouble" : "border-oatmeal focus:border-burning-flame"
              }`}
              required
            />
            {errors.name && (
              <span className="text-[10px] font-medium text-truffle-trouble mt-0.5">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-blue-fantastic">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value as Certification["status"])}
              className="w-full px-2 py-1.5 rounded border border-oatmeal text-xs bg-white focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-blue-fantastic">License/Cert No.</label>
            <input
              type="text"
              value={formData.number || ""}
              onChange={(e) => handleInputChange("number", e.target.value)}
              placeholder="e.g. WC-NSW-88776"
              className={`w-full px-2 py-1.5 rounded border text-xs bg-white focus:outline-none transition-all ${
                errors.number ? "border-truffle-trouble focus:border-truffle-trouble" : "border-oatmeal focus:border-burning-flame"
              }`}
            />
            {errors.number && (
              <span className="text-[10px] font-medium text-truffle-trouble mt-0.5">{errors.number}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-blue-fantastic">Issued Date</label>
            <input
              type="text"
              value={formData.issuedDate || ""}
              onChange={(e) => handleInputChange("issuedDate", e.target.value)}
              placeholder="YYYY-MM-DD"
              className={`w-full px-2 py-1.5 rounded border text-xs bg-white focus:outline-none transition-all ${
                errors.issuedDate ? "border-truffle-trouble focus:border-truffle-trouble" : "border-oatmeal focus:border-burning-flame"
              }`}
            />
            {errors.issuedDate && (
              <span className="text-[10px] font-medium text-truffle-trouble mt-0.5">{errors.issuedDate}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-blue-fantastic">Expiry Date</label>
            <input
              type="text"
              value={formData.expiryDate || ""}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              placeholder="YYYY-MM-DD or Never"
              className={`w-full px-2 py-1.5 rounded border text-xs bg-white focus:outline-none transition-all ${
                errors.expiryDate ? "border-truffle-trouble focus:border-truffle-trouble" : "border-oatmeal focus:border-burning-flame"
              }`}
            />
            {errors.expiryDate && (
              <span className="text-[10px] font-medium text-truffle-trouble mt-0.5">{errors.expiryDate}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-blue-fantastic">Certificate Document</label>
          {formData.fileName ? (
            <div className="flex items-center justify-between bg-white border border-oatmeal/30 rounded px-2.5 py-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-blue-fantastic font-medium min-w-0">
                <FileText size={13} className="text-truffle-trouble shrink-0" />
                <span className="truncate text-xs">{formData.fileName}</span>
              </div>
              <button
                type="button"
                className="text-truffle-trouble p-1 rounded hover:bg-truffle-trouble/10"
                onClick={() => {
                  handleInputChange("fileName", "");
                  handleInputChange("fileUrl", "");
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                id={`edit-file-input-${formData.id}`}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor={`edit-file-input-${formData.id}`}
                className="flex items-center justify-center gap-1.5 border border-dashed border-oatmeal/60 hover:border-burning-flame hover:bg-burning-flame/5 rounded p-2 text-center cursor-pointer transition-all duration-200 text-xs"
              >
                <Upload size={13} className="text-oatmeal" />
                <span className="font-semibold text-blue-fantastic">Upload document</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-oatmeal/20 pt-3">
          <button
            type="button"
            className="px-3 py-1.5 rounded border border-oatmeal text-xs font-semibold text-blue-fantastic hover:bg-oatmeal/10 transition-all"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-burning-flame text-xs font-bold text-abyssal-blue hover:bg-[#ffa447] transition-all"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="group/item bg-oatmeal/5 border border-oatmeal/30 rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-oatmeal/60 hover:bg-oatmeal/10 hover:-translate-y-0.5 relative">
      {/* Edit & Delete hover/visible action buttons in the top right next to badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={onStartEdit}
          className="p-1 rounded bg-white border border-oatmeal/30 hover:border-blue-fantastic hover:bg-palladian text-blue-fantastic transition-all"
          title="Edit Certification"
        >
          <Edit2 size={12} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 rounded bg-white border border-oatmeal/30 hover:border-truffle-trouble hover:bg-truffle-trouble/10 text-truffle-trouble transition-all"
          title="Delete Certification"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="flex justify-between items-start gap-2 pr-14">
        <h4 className="text-sm font-bold text-abyssal-blue leading-snug">{cert.name}</h4>
        <span className={getStatusBadgeClass(cert.status)}>{cert.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-blue-fantastic">
        {cert.number && (
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-oatmeal uppercase tracking-wider">License/Cert No.</span>
            <span className="font-semibold">{cert.number}</span>
          </div>
        )}
        {cert.issuedDate && (
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-oatmeal uppercase tracking-wider">Issued Date</span>
            <span className="font-semibold">{cert.issuedDate}</span>
          </div>
        )}
        {cert.expiryDate && (
          <div className="flex flex-col col-span-2 mt-1">
            <span className="text-[9px] font-bold text-oatmeal uppercase tracking-wider">Expiry Date</span>
            <span className="font-semibold">{cert.expiryDate}</span>
          </div>
        )}
      </div>

      {cert.fileName && (
        <div
          onClick={handleViewAttachment}
          className="flex items-center gap-2 bg-white border border-oatmeal/20 px-3 py-2 rounded text-xs font-semibold text-blue-fantastic hover:bg-palladian hover:border-blue-fantastic/30 transition-all cursor-pointer mt-1"
          title="Click to view/download document"
        >
          <FileText size={13} className="text-truffle-trouble shrink-0" />
          <span className="truncate flex-grow">{cert.fileName}</span>
        </div>
      )}
    </div>
  );
}
