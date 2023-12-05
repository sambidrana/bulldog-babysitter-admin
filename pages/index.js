import Bookings from "@/components/Bookings";
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "../components/Layout";

export default function Home() {
  const {data: session} = useSession();
  return (
    <Layout>
      <div>
        Hello, {session?.user?.name}
        <Bookings />
      </div>
    </Layout>
  )
}
