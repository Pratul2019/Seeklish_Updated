// components/Navigation.tsx
import Link from "next/link";

import { SiWpexplorer } from "react-icons/si";
import { HiHomeModern } from "react-icons/hi2";
import { MdAppShortcut } from "react-icons/md";

interface NavigationProps {
  pathname?: string;
}

const categories = [
  { id: "discover", label: "Discover", icon: SiWpexplorer, href: "/discover" },
  { id: "rental", label: "Rental", icon: HiHomeModern, href: "/rental" },
  { id: "application", label: "Application", icon: MdAppShortcut, href: "/application" },
];

const Navigation: React.FC<NavigationProps> = ({ pathname }) => {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <Link href={category.href}>
            <div
              className={`flex items-center gap-2 ${
                pathname === category.href ? "text-primary" : ""
              }`}
            >
              <category.icon />
              <span>{category.label}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Navigation;