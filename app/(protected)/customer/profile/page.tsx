import ProfileHeader from "@/components/Customer/Profile/profile-header"
import PersonalInformation from "@/components/Customer/Profile/personal-information"
import PasswordSecurity from "@/components/Customer/Profile/password-security"
import LinkedAccounts from "@/components/Customer/Profile/linked-accounts"
// import SessionCard from "@/components/Customer/Profile/session-card"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 w-full px-5 py-1">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
        {/* Left Column */}
        <PersonalInformation />

        {/* Right Column */}
        <div className="space-y-6">
          <PasswordSecurity />
          <LinkedAccounts />
          {/* <SessionCard /> */}
        </div>
      </div>
    </div>
  )
}