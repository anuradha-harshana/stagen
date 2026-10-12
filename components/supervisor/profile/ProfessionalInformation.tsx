import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Award, UserRoundPen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileFormField } from "./ProfileFormField";

interface ProfessionalInformationProps {
  yearsOfExperience: number;
  expertise: string[];
  onSave: (updated: {
    yearsOfExperience: number;
    expertise: string[];
  }) => void;
}

const professionalInfoSchema = z.object({
  yearsOfExperience: z.number().min(0, "Years of experience cannot be negative."),
  expertiseInput: z.string(),
});

type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;

export function ProfessionalInformation({
  yearsOfExperience,
  expertise,
  onSave,
}: ProfessionalInformationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      yearsOfExperience,
      expertiseInput: expertise.join(", "),
    },
  });

  const handleOpen = () => {
    reset({
      yearsOfExperience,
      expertiseInput: expertise.join(", "),
    });
    setIsOpen(true);
  };

  const onSubmit = (data: ProfessionalInfoFormData) => {
    const parsedExpertise = data.expertiseInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      yearsOfExperience: Number(data.yearsOfExperience),
      expertise: parsedExpertise,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Card className="border-2 border-palladian bg-white shadow-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-4 border-b border-oatmeal/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffb162]/10 text-truffle-trouble">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-abyssal-blue">Professional Information</CardTitle>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5"
            onClick={handleOpen}
          >
            <UserRoundPen className="mr-1.5 h-3.5 w-3.5" />
            Edit Info
          </Button>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-inset border border-oatmeal/20 w-fit">
            <div className="text-5xl font-extrabold text-blue-fantastic leading-none">
              {yearsOfExperience}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-blue-fantastic leading-snug">Years of Experience</span>
              <span className="text-[11px] text-blue-fantastic/60">In Construction Management & Supervision</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">Areas of Expertise</span>
            <div className="flex flex-wrap gap-2">
              {expertise.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-white border-2 border-oatmeal/30 text-blue-fantastic/80 px-4 py-1 rounded-full text-xs font-bold"
                >
                  {item}
                </span>
              ))}
              {expertise.length === 0 && (
                <span className="text-xs text-blue-fantastic/40 italic">No expertise areas defined.</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Professional Info Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyssal-blue/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-oatmeal/30 overflow-hidden transform transition-all">
            <div className="flex justify-between items-center px-6 py-4 border-b border-oatmeal/10 bg-surface-inset">
              <h3 className="font-bold text-blue-fantastic text-base">Edit Professional Info</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-oatmeal/20 text-blue-fantastic/60 hover:text-blue-fantastic transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <ProfileFormField
                label="Years of Experience"
                type="number"
                min="0"
                error={errors.yearsOfExperience?.message}
                {...register("yearsOfExperience", { valueAsNumber: true })}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">
                  Areas of Expertise (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Commercial, Residential, Infrastructure, Framing"
                  className="px-3.5 py-2 text-sm bg-white border-2 border-oatmeal/35 rounded-2xl text-blue-fantastic focus:border-[#ffb162] outline-none transition-all font-sans font-medium resize-none"
                  {...register("expertiseInput")}
                />
                <span className="text-[10px] text-blue-fantastic/50">Separate each expertise area with a comma.</span>
              </div>
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
