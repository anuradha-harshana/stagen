import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const filters = [
  "All",
  "Unread",
  "Progress Updates",
  "Invoices & Payments",
  "Inspections",
  "Warranty",
  "System",
];

const NotificationFilter = () => {
  return (
    <Card className="rounded-2xl p-5 flex flex-col  bg-palladian" >

      <h2 className="mb-1 text-lg font-semibold  text-foreground flex-row ">
        Filter
      </h2>

      <div className="space-y-2">

        {filters.map((filter) => (
          <Button
            key={filter}
            variant={filter === "All" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            {filter}
          </Button>
        ))}

      </div>

    </Card>
  );
};

export default NotificationFilter;