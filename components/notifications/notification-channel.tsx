import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const channels = [
  "In-app",
  "Email",
  "Push",
];

const NotificationChannel = () => {
  return (
    <Card className="rounded-2xl px-5 py-6 shadow-sm bg-palladian">

      <h2 className="mb-1 text-lg font-semibold text-foreground">
        Notification Channels
      </h2>

      <div className="space-y-4">

        {channels.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between text-sm font-medium text-muted-foreground"
          >
            <span>{item}</span>

            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        ))}

      </div>

    </Card>
  );
};

export default NotificationChannel;