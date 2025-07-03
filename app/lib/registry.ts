"use server";

import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";

export const getRegistrationOptions = async (
  ephemeralWalletAddress: string
): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  const registrationOptionsParameters: GenerateRegistrationOptionsOpts = {
    rpName: "Passkeys TACo PoC",
    rpID: "localhost",
    userName: "manumonti",
    userID: isoUint8Array.fromASCIIString(ephemeralWalletAddress),
    // challenge: "",
    userDisplayName: "Manuel Montenegro",
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
  let verification: VerifiedRegistrationResponse;

  if (credential == null) {
    throw new Error("Invalid credentials");
  }

  try {
    verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  if (!verification.verified) {
    throw new Error("Registration verification failed");
  }

  return verification;
};
