import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, UserRoundPen, Phone, Mail, MapPin, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProfileFormField } from "./ProfileFormField";

interface PersonalInformationProps {
  fullName: string;
  employeeId: string;
  contactNumber: string;
  emailAddress: string;
  officeBranch: string;
  onSave: (updated: {
    fullName: string;
    employeeId: string;
    contactNumber: string;
    emailAddress: string;
    officeBranch: string;
  }) => void;
}

const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required.")
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be under 80 characters.")
    .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes."),
  contactNumber: z
    .string()
    .min(1, "Contact number is required.")
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Enter a valid phone number (7–20 digits)."),
  emailAddress: z
    .string()
    .min(1, "Email address is required.")
    .email("Enter a valid email address (e.g. name@example.com)."),
  officeBranch: z
    .string()
    .min(1, "Office/Branch is required.")
    .min(3, "Office/Branch must be at least 3 characters."),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export function PersonalInformation({
  fullName,
  employeeId,
  contactNumber,
  emailAddress,
  officeBranch,
  onSave,
}: PersonalInformationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { fullName, contactNumber, emailAddress, officeBranch },
  });

  const handleOpen = () => {
    reset({ fullName, contactNumber, emailAddress, officeBranch });
    setIsOpen(true);
  };

  const onSubmit = (data: PersonalInfoFormData) => {
    onSave({ ...data, employeeId });
    setIsOpen(false);
    toast.success("Personal information updated.");
  };

  const onError = () => {
    toast.error("Please fix the highlighted errors before saving.");
  };

  return (
    <>
      <Card className="border-2 border-palladian bg-white shadow-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-4 border-b border-oatmeal/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffb162]/10 text-truffle-trouble">
              <Shield className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg font-bold text-abyssal-blue">Personal Information</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5"
            onClick={handleOpen}
          >
            <UserRoundPen className="mr-1.5 h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Full Name</span>
              <span className="text-sm font-bold text-blue-fantastic">{fullName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Employee ID</span>
              <span className="text-sm font-bold text-blue-fantastic">{employeeId}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Contact Number</span>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-fantastic">
                <Phone className="h-3.5 w-3.5 text-oatmeal" />
                <span>{contactNumber}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Email Address</span>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-fantastic">
                <Mail className="h-3.5 w-3.5 text-oatmeal" />
                <span>{emailAddress}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <span className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Office/Branch</span>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-fantastic">
                <MapPin className="h-3.5 w-3.5 text-oatmeal" />
                <span>{officeBranch}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Personal Profile Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyssal-blue/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-oatmeal/30 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-oatmeal/10 bg-palladian/30">
              <h3 className="font-bold text-blue-fantastic text-base">Edit Personal Information</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-oatmeal/20 text-blue-fantastic/60 hover:text-blue-fantastic transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="p-6 space-y-4" noValidate>
              <ProfileFormField
                label="Full Name"
                required
                placeholder="e.g. Marcus Vance"
                maxLength={80}
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <ProfileFormField
                label="Contact Number"
                required
                type="tel"
                placeholder="e.g. +61 491 570 156"
                error={errors.contactNumber?.message}
                {...register("contactNumber")}
              />
              <ProfileFormField
                label="Email Address"
                required
                type="email"
                placeholder="e.g. name@stagen.com.au"
                error={errors.emailAddress?.message}
                {...register("emailAddress")}
              />
              <ProfileFormField
                label="Office/Branch"
                required
                placeholder="e.g. Sydney Head Office (HQ)"
                error={errors.officeBranch?.message}
                {...register("officeBranch")}
              />

              <p className="text-[10px] text-blue-fantastic/40">
                Fields marked <span className="text-rose-400 font-bold">*</span> are required.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-oatmeal/50 text-blue-fantastic"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-fantastic text-white hover:bg-blue-fantastic/90 rounded-2xl"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
