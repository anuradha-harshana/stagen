import ProfileHeader from "@/components/Customer/Profile/ProfileHeader"
import PersonalInformation from "@/components/Customer/Profile/PersonalInformation"
import PasswordSecurity from "@/components/Customer/Profile/PasswordSecurity"
import LinkedAccounts from "@/components/Customer/Profile/LinkedAccounts"
// import SessionCard from "@/components/Customer/Profile/session-card"

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
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