/** @format */

"use client";

import React, { Suspense } from "react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Loading } from "@/components/ui/Loading";

function SearchContent() {
  return <GlobalSearch />;
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loading size="lg" text="Loading search..." />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
