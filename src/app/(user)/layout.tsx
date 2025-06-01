/** @format */

import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <>
      <Layout>{children}</Layout>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default layout;
