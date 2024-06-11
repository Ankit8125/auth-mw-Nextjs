import { fetchAuthUserAction } from "@/actions";
import Logout from "@/components/log-out";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  
  const currentUser = await fetchAuthUserAction() // returning success is false, if token is invalid
  if(!currentUser?.success){ // if token empty, redirecting user to sign-in page
    redirect('/sign-in')
  }

  return (
    <div>
      <h1>Next JS Authentication</h1>
      <h2>{currentUser?.data?.userName}</h2>
      <p>{currentUser?.data?.email}</p>
      <Logout/>
    </div>
  );
}
