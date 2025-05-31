/** @format */

import { redirect } from "next/navigation";

const page = () => {
  // redirect
  redirect("/auth/login");
  return <div>page</div>;
};

export default page;
