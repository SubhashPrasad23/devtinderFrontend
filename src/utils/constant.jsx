import { Users, UserPlus, MessageSquare } from "lucide-react";
export const navItems = [
    {
      path: "connections",
      icon: <Users className="w-5 h-5" />,
      label: "Connections",
    },
    {
      path: "requests",
      icon: <UserPlus className="w-5 h-5" />,
      label: "Requests",
    },
    {
      path: "chat",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chat",
    },
  ];