import { Card } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
};

const NotificationCard = ({ title, description, time, icon }: Props) => {
  return (
    <Card className=" justify-between flex flex-row gap-6 rounded-2xl px-6 py-5 shadow-sm bg-palladian text-blue text-sm font-bold font-cream">
      <div className="flex min-w-0 items-center gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
          <span className="flex h-6 w-6 items-center justify-center">
            {icon}
          </span>
        </div>

        <div className="min-w-0 space-y-1">
          <h3 className="text-[15px] font-semibold leading-6 text-foreground">
            {title}
          </h3>

          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex  gap-4">
        <span className="text-sm text-muted-foreground ">{time}</span>

        <div className="w-2 h-2 rounded-full bg-orange-500" />
      </div>
    </Card>
  );
};

export default NotificationCard;
