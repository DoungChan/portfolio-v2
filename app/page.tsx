import Menu from "@/components/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import CustomAvatar from "@/components/CustomAvatar";
import { Profile } from "@/components/Proflie";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <Profile />
    </main>
  );
}
