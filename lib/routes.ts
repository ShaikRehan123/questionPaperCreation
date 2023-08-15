import { FolderIcon, LucideIcon, FileSpreadsheet } from "lucide-react";

interface AdminRoute {
  path: string;
  name: string;
  icon: LucideIcon;
}

export const adminRoutes: AdminRoute[] = [
  { path: "/exams", name: "Exams", icon: FolderIcon },
  // { path: "/questions", name: "Questions", icon: FileSpreadsheet },
];
