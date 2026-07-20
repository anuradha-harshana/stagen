import { SupervisorProfile } from "@/lib/types/profile";

export const initialProfile: SupervisorProfile = {
  fullName: "Marcus Vance",
  employeeId: "EMP-2026-9843",
  profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&fit=crop",
  contactNumber: "+61 491 570 156",
  emailAddress: "marcus.vance@stagen.com.au",
  officeBranch: "Sydney Head Office (HQ)",
  status: "Onsite",
  yearsOfExperience: 8,
  expertise: ["Commercial", "Residential", "Infrastructure"],
  certifications: [
    {
      id: "cert-1",
      name: "White Card Induction",
      status: "Verified",
      number: "WC-NSW-88776655",
      issuedDate: "2021-04-12",
      expiryDate: "Never Expires",
      fileName: "white_card_marcus.pdf"
    },
    {
      id: "cert-2",
      name: "First Aid Level II & CPR",
      status: "Active",
      number: "FA-992384",
      issuedDate: "2024-02-15",
      expiryDate: "2027-02-15",
      fileName: "first_aid_cert_marcus.pdf"
    },
    {
      id: "cert-3",
      name: "OHS Construction Supervisor Certificate",
      status: "Active",
      number: "OHS-SUP-40112",
      issuedDate: "2023-08-10",
      expiryDate: "2026-08-10",
      fileName: "ohs_supervisor_cert.pdf"
    },
    {
      id: "cert-4",
      name: "SWMS Electrical & Structural Agreement",
      status: "Verified",
      number: "SWMS-STG-2026",
      issuedDate: "2026-01-10",
      expiryDate: "2027-01-10",
      fileName: "swms_agreement_signed.pdf"
    }
  ]
};

export const AVAILABLE_EXPERTISE_OPTIONS = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Civils & Earthworks",
  "Demolition",
  "Renovations",
  "High-Rise Construction"
];

export const OFFICE_BRANCH_OPTIONS = [
  "Sydney Head Office (HQ)",
  "Melbourne Operations Center",
  "Brisbane Regional Branch",
  "Adelaide Branch Office",
  "Perth Logistics Depot"
];
