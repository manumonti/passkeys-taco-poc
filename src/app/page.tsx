import Image from "next/image";

import PasskeysManagement from "../components/passkeys-management";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
        <Image
          className="dark:invert"
          src="/taco.svg"
          alt="TACo logo"
          width={300}
          height={128}
          priority
        />
        <PasskeysManagement />
      </main>
    </div>
  );
}
