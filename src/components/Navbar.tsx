
import React from 'react';
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { Plane, Menu, Bell, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-slate-700/50 py-3 px-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <Plane className="text-blue-500 w-5 h-5" />
        <span className="font-bold text-lg">SkyTrack Pro</span>
      </div>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
              Anasayfa
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/havaalanlari">
              Havaalanları
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/havayollari">
              Havayolları
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/hakkimizda">
              Hakkımızda
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hidden md:flex">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
