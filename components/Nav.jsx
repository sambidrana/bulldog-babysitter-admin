import Link from "next/link";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
  const inactiveLink = "flex gap-1 p-2 pr-4 pl-4 ";
  const activeLink = `${inactiveLink} bg-gray-100 text-black  rounded-lg`;

  return (
    <>
      <aside className="flex flex-col m-3 mt-10 ">
        <h1>LOGO</h1>
        <nav className="flex flex-col gap-3 p-8 mt-10">
          <Link href="/" className={router.asPath === "/" ? activeLink : inactiveLink}>
            Bookings
          </Link>
          <Link
            href="/boarding"
            className={router.asPath.startsWith("/boarding") ? activeLink : inactiveLink}
          >
            Boarding
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
