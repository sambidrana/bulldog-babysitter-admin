import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./Nav";
export default function Layout({children}) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <h1>"Not logged in"</h1>
        <button onClick={() => signIn()}>LogIn</button>
      </>
    );
  }
  return (
    <>
      <div className="flex min-h-screen bg-[#a9c274]">
        <Nav />
        <div className="bg-white flex-grow mt-2 mr-2 rounded-lg p-4">
          {children}
        </div>
      </div>
    </>
  );
}
