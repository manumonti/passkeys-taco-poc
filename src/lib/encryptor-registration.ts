"use server";

import {
  Wallet,
  isAddress,
  JsonRpcProvider,
  Contract,
  type InterfaceAbi,
  type AddressLike,
} from "ethers";

const globalAllowListAddres: AddressLike =
  "0xd5a66BF5f63dccAFEC74AEe1ba755CD7e06F683a";
const authorizeABI: InterfaceAbi = [
  "function authorize(uint32 ritualId, address[] addresses) external",
];

export const registerEncryptor = async (encryptorAddress: AddressLike) => {
  if (!process.env.RPC_PROVIDER_URL) {
    throw new Error("RPC_PROVIDER_URL is not set in the env vars");
  }
  if (!process.env.AUTHORITY_PRIVATE_KEY) {
    throw new Error("AUTHORITY_PRIVATE_KEY is not set in the env vars");
  }
  if (!process.env.RITUAL_ID) {
    throw new Error("RITUAL_ID is not set in the env vars");
  }

  if (!isAddress(encryptorAddress)) {
    throw new Error("Invalid encryptor address provided");
  }

  const provider = new JsonRpcProvider(process.env.RPC_PROVIDER_URL);
  const authorityWallet = new Wallet(
    process.env.AUTHORITY_PRIVATE_KEY,
    provider
  );
  const globalAllowListContract = new Contract(
    globalAllowListAddres,
    authorizeABI,
    authorityWallet
  );

  console.debug(
    "Registring encryptor address",
    encryptorAddress,
    "on ritual",
    process.env.RITUAL_ID
  );

  const tx = await globalAllowListContract.authorize(
    parseInt(process.env.RITUAL_ID),
    [encryptorAddress]
  );
  console.debug(`TX: https://amoy.polygonscan.com/tx/${tx.hash}/`);
  console.debug("Waiting for tx confirmation...");

  await tx.wait();
  console.log("✅ Tx confirmed");
};
