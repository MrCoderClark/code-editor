import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const LogOutButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    router.refresh();
  };

  return <span onClick={onLogout}>{children}</span>;
};

export default LogOutButton;
