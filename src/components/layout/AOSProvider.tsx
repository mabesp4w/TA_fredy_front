/** @format */

"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
      delay: 0,
    });
  }, []);

  return <>{children}</>;
};

