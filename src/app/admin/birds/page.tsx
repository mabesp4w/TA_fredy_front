/** @format */

"use client";

import React from "react";
import { BirdList } from "@/components/bird/BirdList";

export default function BirdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BirdList showFamilyFilter={true} />
    </div>
  );
}
