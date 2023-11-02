import { Profile } from "@/components/Proflie";
export default function Home() {
  return (
    <main
      className={` flex min-h-screen flex-col items-center justify-between`}
    >
      <Profile />
    </main>
  );
}
