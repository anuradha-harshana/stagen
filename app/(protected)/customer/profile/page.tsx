import ProfileHeader from "@/components/Customer/Profile/profile-header"
import PersonalInformation from "@/components/Customer/Profile/personal-information"
import PasswordSecurity from "@/components/Customer/Profile/password-security"
import LinkedAccounts from "@/components/Customer/Profile/linked-accounts"
import SessionCard from "@/components/Customer/Profile/session-card"

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-oatmeal p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
          {/* Left */}
          <PersonalInformation />

          {/* Right */}
          <div className="space-y-6">
            <PasswordSecurity />
            <LinkedAccounts />
            <SessionCard />
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage