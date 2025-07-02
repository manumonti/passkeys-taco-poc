"use client";

function handleClick() {
  console.log("Registry new Passkey");
}

export default function RegisterPasskey() {
  return (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      onClick={handleClick}
    >
      Registry new Passkey
    </button>
  );
}
