import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <>
      <h2>Account</h2>
      {session ? (
        <>
          <div className="grid grid-cols-2 gap-2 pb-4">
            <p>Account Name</p>
            <p>{session.user.displayName}</p>
            <p>Email</p>
            <p>{session.user.email}</p>
            <p>Phone</p>
            <p>{session.user.phone}</p>
          </div>
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      ) : (
        <>
          <p className="pb-4">You are not signed in.</p>
          <Link href="/login" className="text-sm hover:underline">
            Sign in
          </Link>
        </>
      )}
    </>
  );
}
