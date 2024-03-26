import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Nav = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const inactiveLink = "text-sm md:text-lg flex gap-1 p-2 pr-2 pl-2 md:pr-4 md:pl-4 hover:scale-110 hover:text-white ";
  const activeLink = `${inactiveLink} bg-gray-100 text-black rounded-lg shadow-md md:shadow-lg`;

  return (
    <>
      <aside className="flex flex-col m-3 mt-10 hide-print font-serif  ">
        <div className="flex items-center justify-center">
          <div className="w-10 md:w-24 ">
            <Image className="rounded-full" src="/logo1.png" width={200} height={200} alt="The Bulldog Babysitter"/>
            <p className="text-white mt-2 text-sm md:text-lg">Hello, {session?.user?.name}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-3 pl-1 pr-1 md:pl-6 md:pr-4 mt-6">
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
