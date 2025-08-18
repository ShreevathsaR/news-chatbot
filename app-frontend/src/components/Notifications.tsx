import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Notification } from "@/lib/types/notification";
import { deleteNotifications } from "@/lib/api/notifications";

const Notifications = ({
  notifications,
  clearNotifications,
}: {
  notifications: Notification[];
  clearNotifications: () => void;
}) => {
  const [open, setOpen] = useState(false);

  async function handleClear() {
    clearNotifications();
    await deleteNotifications();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="ghost">
          {notifications?.length > 0 ? (
            <Bell className="w-4 h-4" />
          ) : (
            <Bell className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 255, 255, 0.5) transparent",
        }}
        className="max-w-md w-full bg-black text-white max-h-96 overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <ul className="flex flex-col gap-3 w-full overflow-y-auto">
            {notifications?.map((notif, index) => (
              <a
                href={notif.url}
                key={index}
                className="truncate w-full rounded overflow-y-auto text-wrap flex flex-col gap-2 bg-white/10 p-3"
              >
                <p className="text-wrap font-semibold">{notif.title}</p>
                {notif.content && (
                  <p className="truncate text-wrap text-white/60 font-thin max-h-24">
                    {notif.content}
                  </p>
                )}
              </a>
            ))}
          </ul>
          <Button onClick={() => handleClear()}>Clear All</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Notifications;
