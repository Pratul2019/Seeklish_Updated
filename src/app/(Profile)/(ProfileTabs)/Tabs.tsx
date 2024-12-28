"use client";
import React, { memo, useMemo } from "react";
import { IconType } from "react-icons";
import { HiHomeModern } from "react-icons/hi2";
import { MdAppShortcut } from "react-icons/md";
import { SiWpexplorer } from "react-icons/si";
import ProfileDiscover from "./ProfileDiscover";
import ProfileRental from "./ProfileRental";
import ProfileApp from "./ProfileApplication";

interface TabIconProps {
  Icon: IconType;
  isActive: boolean;
  count: number;
  onClick: () => void;
}

const TabIcon = memo(({ 
  Icon, 
  isActive, 
  count, 
  onClick 
}: TabIconProps) => (
  <div 
    className={`flex gap-3 items-center ${isActive ? "text-teal-500" : ""}`} 
    onClick={onClick}
  >
    <Icon 
      size={30} 
      className="cursor-pointer hover:text-teal-500"
    />
    <span className="text-gray-400">{count}</span>
  </div>
));

TabIcon.displayName = 'TabIcon';

interface ProfileCounts {
  discoverCount: number;
  rentalCount: number;
  applicationCount: number;
}

interface TabsProps {
  discoverpro: [];
  rentalpro: [];
  applicationpro: [];
  isAllowed: boolean;
  profileCounts: ProfileCounts;
}

export default function Tabs({ 
  discoverpro, 
  rentalpro, 
  applicationpro, 
  isAllowed, 
  profileCounts 
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState<string>("discover");

  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const renderTabContent = useMemo(() => {
    switch(activeTab) {
      case "discover":
        return <ProfileDiscover discoverpro={discoverpro} isAllowed={isAllowed} />;
      case "rental":
        return <ProfileRental rentalpro={rentalpro} isAllowed={isAllowed} />;
      case "application":
        return <ProfileApp apppro={applicationpro} isAllowed={isAllowed} />;
      default:
        return null;
    }
  }, [activeTab, discoverpro, rentalpro, applicationpro, isAllowed]);

  return (
    <div>
      <div className="flex gap-12 mt-6 justify-center">
        <TabIcon 
          Icon={SiWpexplorer} 
          isActive={activeTab === "discover"}
          count={profileCounts.discoverCount}
          onClick={() => handleTabChange("discover")}
        />
        <TabIcon 
          Icon={HiHomeModern} 
          isActive={activeTab === "rental"}
          count={profileCounts.rentalCount}
          onClick={() => handleTabChange("rental")}
        />
        <TabIcon 
          Icon={MdAppShortcut} 
          isActive={activeTab === "application"}
          count={profileCounts.applicationCount}
          onClick={() => handleTabChange("application")}
        />
      </div>
      {renderTabContent}
    </div>
  );
}