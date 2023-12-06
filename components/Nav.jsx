import Link from "next/link";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Nav = () => {
  return (
    <>
      <aside className="flex flex-col m-3 mt-10 ">
        <h1>LOGO</h1>
        <nav className="flex flex-col gap-3 p-8 mt-10">
          <Link href={"/"}>Bookings</Link>
          <Link href={"/boarding"}>Boarding</Link>
          <div>
            <button onClick={() => signOut()}>LogOut</button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Nav;
