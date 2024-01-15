import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Nav = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const inactiveLink = "flex gap-1 p-2 pr-4 pl-4 ";
  const activeLink = `${inactiveLink} bg-gray-100 text-black  rounded-lg shadow-lg`;

  return (
    <>
      <aside className="flex flex-col m-3 mt-10 hide-print ">
        <h1>LOGO</h1>
        <p className="text-white mt-2">Hello, {session?.user?.name}</p>
        <nav className="flex flex-col gap-3 p-8 mt-10">
          <Link
            href="/"
            className={router.asPath === "/" ? activeLink : inactiveLink}
          >
            Bookings
          </Link>
          <Link
            href="/boarding"
            className={
              router.asPath.startsWith("/boarding") ? activeLink : inactiveLink
            }
          >
            Boarding
          </Link>
          <Link
            href="/enquiries"
            className={
              router.asPath.startsWith("/enquiries") ? activeLink : inactiveLink
            }
          >
            Enquiries
          </Link>
          <Link
            href="/settings"
            className={
              router.asPath.startsWith("/settings") ? activeLink : inactiveLink
            }
          >
            Settings
          </Link>
          <div className={inactiveLink}>
            <button onClick={() => signOut()}>LogOut</button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Nav;
