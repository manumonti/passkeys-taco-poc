"use server";

import bcrypt from "bcryptjs";
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
  type PublicKeyCredentialCreationOptionsJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";

export const getRegistrationOptions = async (
  ephemeralWalletAddress: string
): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  const salt = await bcrypt.genSalt();
  const challenge = await bcrypt.hash(ephemeralWalletAddress, salt);

  const registrationOptionsParameters: GenerateRegistrationOptionsOpts = {
    rpName: "Passkeys TACo PoC",
    rpID: "localhost",
    userName: ephemeralWalletAddress,
    userID: isoUint8Array.fromASCIIString(ephemeralWalletAddress),
    challenge: isoUint8Array.fromASCIIString(challenge),
    userDisplayName: ephemeralWalletAddress,
    timeout: 60000,
    // excludeCredentials: [],
    // TODO: use algorithms with a good compatibility with solidity
    supportedAlgorithmIDs: [-7, -257],
  };

  const registrationOptions = await generateRegistrationOptions(
    registrationOptionsParameters
  );

  return registrationOptions;
};

export const verifyRegistration = async (
  credential: RegistrationResponseJSON,
  challenge: string
): Promise<VerifiedRegistrationResponse> => {
  let verificationResponse: VerifiedRegistrationResponse;

  if (credential == null) {
    throw new Error("Invalid credentials");
  }

  try {
    verificationResponse = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  if (!verificationResponse.verified) {
    throw new Error("Registration verification failed");
  }

  return verificationResponse;
};
