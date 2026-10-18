import { requireRole } from "@/lib/auth/auth";
import { getCustomerProfile } from "@/lib/customer/customerProfile";
import ProfileHeader from "@/components/Customer/Profile/ProfileHeader";
import PersonalInformation from "@/components/Customer/Profile/PersonalInformation";
import PasswordSecurity from "@/components/Customer/Profile/PasswordSecurity";
import LinkedAccounts from "@/components/Customer/Profile/LinkedAccounts";

export default async function ProfilePage() {
  const user = await requireRole(["customer"]);
  const profile = await getCustomerProfile(user.id);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
        {/* Left Column */}
        <PersonalInformation profile={profile} />

        {/* Right Column */}
        <div className="space-y-6">
          <PasswordSecurity profile={profile} />
          <LinkedAccounts linkedAccounts={profile?.linkedAccounts} />
        </div>
      </div>
    </div>
  );
}