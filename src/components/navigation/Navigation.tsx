/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bird,
  TreePine,
  Camera,
  Volume2,
  Home,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "../ui/Button";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: number;
  children?: SubNavItem[];
}

interface SubNavItem {
  name: string;
  href: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
    description: "Overview & Analisis",
  },
  {
    name: "Families",
    href: "/admin/families",
    icon: TreePine,
    description: "Keluarga burung",
  },
  {
    name: "Burung",
    href: "/admin/birds",
    icon: Bird,
    description: "Spesies burung",
  },
  {
    name: "Gambar",
    href: "/admin/images",
    icon: Camera,
    description: "Galeri gambar",
  },
  {
    name: "Suara",
    href: "/admin/sounds",
    icon: Volume2,
    description: "Audio library",
  },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-base-100 shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Bird className="w-8 h-8 text-primary group-hover:text-primary-focus transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  Kicauan Burung
                </span>
                <div className="text-xs text-gray-500 -mt-1">
                  Klasifikasi Burung berdasarkan kicauan
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);

                return (
                  <div key={item.name} className="relative">
                    {item.children ? (
                      // Dropdown Menu
                      <div className="dropdown dropdown-hover">
                        <button
                          tabIndex={0}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary text-primary-content"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="ml-2 badge badge-error badge-xs">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </button>

                        <ul className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-64 border">
                          <li className="menu-title px-3 py-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {item.description}
                            </span>
                          </li>
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className="flex flex-col items-start p-3 hover:bg-gray-50 rounded-lg"
                              >
                                <span className="font-medium text-gray-900">
                                  {child.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {child.description}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      // Regular Link
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-content"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-2 badge badge-error badge-xs">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <Link href="/admin/search" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </Link>

              {/* Quick Add */}
              <div className="dropdown dropdown-end hidden md:block">
                <Button tabIndex={0} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
                <ul className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border">
                  <li>
                    <Link href="/admin/families?action=create">
                      Tambah Keluarga
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/birds?action=create">Tambah Burung</Link>
                  </li>
                  <li>
                    <Link href="/admin/images?action=upload">
                      Upload Gambar
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/sounds?action=upload">Upload Suara</Link>
                  </li>
                </ul>
              </div>

              {/* User Menu */}
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </button>
                <ul className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border">
                  <li className="menu-title">
                    <span>Profil</span>
                  </li>
                  <li>
                    <a>
                      <User className="w-4 h-4" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a>
                      <Settings className="w-4 h-4" />
                      Settings
                    </a>
                  </li>
                  <li>
                    <a>
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </a>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <a className="text-error">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </a>
                  </li>
                </ul>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden btn btn-ghost btn-circle"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-base-100 border-t">
            <div className="px-4 py-3 space-y-1">
              {/* Search Bar for Mobile */}
              <div className="pb-3">
                <Link href="/search" onClick={closeMobileMenu}>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="input input-bordered input-sm w-full"
                    />
                    <button className="btn btn-square btn-sm">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              </div>

              {/* Main Navigation Items */}
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);

                return (
                  <div key={item.name}>
                    {item.children ? (
                      // Collapsible Section
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(item.name)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary text-primary-content"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <IconComponent className="w-4 h-4 mr-3" />
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="ml-2 badge badge-error badge-xs">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {activeDropdown === item.name && (
                          <div className="pl-8 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={closeMobileMenu}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular Link
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-content"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-3" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-2 badge badge-error badge-xs">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Mobile Quick Actions */}
              <div className="pt-3 border-t mt-3">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/families?action=create"
                    onClick={closeMobileMenu}
                  >
                    <Button variant="outline" size="sm" fullWidth>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Family
                    </Button>
                  </Link>
                  <Link href="/birds?action=create" onClick={closeMobileMenu}>
                    <Button variant="outline" size="sm" fullWidth>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Bird
                    </Button>
                  </Link>
                  <Link href="/images?action=upload" onClick={closeMobileMenu}>
                    <Button variant="outline" size="sm" fullWidth>
                      <Camera className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  </Link>
                  <Link href="/sounds?action=upload" onClick={closeMobileMenu}>
                    <Button variant="outline" size="sm" fullWidth>
                      <Volume2 className="w-3 h-3 mr-1" />
                      Record
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};
