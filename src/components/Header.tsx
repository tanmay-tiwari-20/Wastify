// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Menu,
  Coins,
  Leaf,
  Search,
  Bell,
  LogIn,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  markNotificationAsRead,
} from "@/utils/db/actions";
import Image from "next/image";

// Clerk
import { useUser, UserButton } from "@clerk/nextjs";

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings: number;
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/report", label: "Report" },
    { href: "/collect", label: "Collect" },
    { href: "/rewards", label: "Reward" },
    { href: "/calculator", label: "Calculator" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo & Hamburger */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Image src="/w.png" alt="logo" width={60} height={60} />
            <div className="flex flex-col ml-1">
              <span className="font-bold text-lg text-gray-800">
                Wastify
              </span>
              <span className="text-[10px] text-gray-400 -mt-1">
                HackOClock
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05, color: "#16a34a" }}
            >
              <Link
                href={link.href}
                className={`${
                  pathname === link.href ? "text-green-600" : "text-gray-700"
                } transition-colors duration-200`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {isMobile && (
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon">
              </Button>
            </motion.div>
          )}

          <motion.div whileTap={{ scale: 0.9 }} className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div>
                        <span className="font-semibold">
                          {notification.type}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {notification.message}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Auth section */}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/sign-in")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Sign In
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
