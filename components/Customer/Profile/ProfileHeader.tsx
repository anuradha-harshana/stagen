import { User, ShieldCheck, UserCheck } from "lucide-react"

const ProfileHeader = () => {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-blue-fantastic/15 font-sans">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <User className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
            Customer Profile
          </h1>
          <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
            Manage your personal details, security settings, and active sessions
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-1.5 rounded-full border border-blue-fantastic/15 bg-blue-fantastic/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span className="text-xs text-blue-fantastic font-semibold font-sans">Verified Account</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-blue-fantastic/15 bg-blue-fantastic/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-truffle-trouble" />
          <span className="text-xs text-blue-fantastic font-semibold font-sans">Customer Portal</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader