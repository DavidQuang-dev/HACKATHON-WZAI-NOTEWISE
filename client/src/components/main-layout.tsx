"use client";

import {
  BookOpen,
  Check,
  ChevronDown,
  GraduationCap,
  LogOut,
  Monitor,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { title: "Home", url: "/dashboard" },
  { title: "Notes", url: "/notes" },
  { title: "Record", url: "/record" },
  { title: "Upload", url: "/upload" },
];

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor },
  ];
  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    // { code: "zh", name: "中文", flag: "🇨🇳" },
    // { code: "ko", name: "한국어", flag: "🇰🇷" },
    // { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  const handdleLogout = () => {
    // Redirect to login page
    router.push("/");
    // Logic to handle logout
    useAuthStore.getState().logout();
  };
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-8 py-5 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BookOpen className="h-6 w-6 text-white" />
                <GraduationCap className="h-3 w-3 text-blue-200 absolute -top-1 -right-1" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              NoteWise
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url);
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* User Avatar */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="hidden lg:flex items-center space-x-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-auto px-3 hover:bg-blue-100"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 border-2 border-blue-400">
                            <AvatarImage
                              src={user?.avatar || undefined}
                              alt="Student Avatar"
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-800 font-bold">
                              {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="hidden md:block text-left">
                            <div className="font-bold text-blue-800 text-sm">
                              {user?.name || "Chưa đăng nhập"}
                            </div>
                            <div className="text-blue-600 text-xs">
                              {user?.email || "Chưa đăng nhập"}
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-80 bg-white border-2 border-blue-200 shadow-xl shadow-blue-100/50"
                      align="end"
                    >
                      {/* User Info Header */}
                      <DropdownMenuLabel className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="text-blue-600 text-xs">
                              {user?.email || "Chưa đăng nhập"}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator className="bg-blue-200" />

                      {/* Menu Items */}
                      <DropdownMenuItem className="p-3 hover:bg-blue-50 cursor-pointer hover:outline-none flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-blue-800">
                            Hồ sơ cá nhân
                          </div>
                          <div className="text-xs text-blue-600">
                            Xem và chỉnh sửa thông tin
                          </div>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-blue-200" />

                      {/* Preferences Section */}
                      <div className="px-4 py-2">
                        {/* Theme Selector */}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-blue-600 font-medium">
                            Giao diện
                          </span>
                          <div className="flex items-center gap-1 rounded-full border border-blue-300 bg-white shadow-sm px-1 py-0.5">
                            {themes.map((theme) => {
                              const IconComponent = theme.icon;
                              const isSelected = selectedTheme === theme.id;

                              return (
                                <Button
                                  key={theme.id}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTheme(theme.id)}
                                  className={`h-6 w-6 p-0 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out${
                                    isSelected
                                      ? " bg-blue-100 text-blue-700 shadow-sm"
                                      : " text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <IconComponent className="h-3 w-3" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-blue-600 font-medium">
                            Ngôn ngữ
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-sm h-6 px-2 text-sm pl-0 hover:bg-gray-100 border border-blue-300 flex items-center justify-between space-x-2"
                              >
                                <span className="flex items-center justify-center mr-1 pb-1 border-r-2 pr-2 border-blue-300">
                                  {
                                    languages.find(
                                      (lang) => lang.code === selectedLanguage
                                    )?.flag
                                  }
                                </span>
                                <span className="mr-1">
                                  {
                                    languages.find(
                                      (lang) => lang.code === selectedLanguage
                                    )?.name
                                  }
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {languages.map((language) => (
                                <DropdownMenuItem
                                  key={language.code}
                                  className="cursor-pointer"
                                  onClick={() =>
                                    setSelectedLanguage(language.code)
                                  }
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                      <span className="mr-2">
                                        {language.flag}
                                      </span>
                                      <span className="text-sm">
                                        {language.name}
                                      </span>
                                    </div>
                                    {selectedLanguage === language.code && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <DropdownMenuSeparator className="bg-blue-200" />

                      <DropdownMenuItem
                        onClick={handdleLogout}
                        className="p-3 cursor-pointer group flex items-center gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4 group-hover:text-red-700" />
                          <span className="font-medium group-hover:text-red-700">
                            Đăng xuất
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">{children}</main>
    </div>
  );
}
