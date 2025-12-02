/** @format */
"use client";
import React, { useState } from "react";
import { Navigation } from "../navigation/Navigation";
import { Footer } from "../navigation/Footer";
import { MobileBottomNav } from "../navigation/MobileBottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  console.log({ showAddModal });

  const handleMobileAddClick = () => {
    setShowAddModal(true);
    // In a real app, this would open a modal or navigate to add page
    console.log("Mobile add button clicked");
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Main Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-8">{children}</main>

      {/* Footer - Hidden on mobile when bottom nav is visible */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onAddClick={handleMobileAddClick} />
    </div>
  );
};
