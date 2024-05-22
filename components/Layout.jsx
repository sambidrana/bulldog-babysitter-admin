import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Nav from "./Nav";
export default function Layout({ children }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-[#a9c274]">
          <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="p-6">
              <Image
                className="p-8 rounded-full overflow-hidden border-x-8"
                src={"/logo1.png"}
                width={350}
                height={350}
                alt="The Bulldog Babysitter"
                priority
              />
            </div>
            <button
              onClick={() => signIn()}
              className="py-1 px-4 font-serif tracking-widest bg-white border border-black rounded-md hover:shadow-lg"
            >
              LogIn
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex min-h-screen bg-[#a9c274]">
        <Nav />
        <div className="bg-white flex-grow mt-2 mr-2 rounded-lg p-1 md:p-4 ">
          {children}
        </div>
      </div>
    </>
  );
}
