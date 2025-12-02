/** @format */

"use client";

import React from "react";
import { SoundList } from "@/components/sound/SoundList";

export default function SoundsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SoundList showBirdFilter={true} />
    </div>
  );
}
