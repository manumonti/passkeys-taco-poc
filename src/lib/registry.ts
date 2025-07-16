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
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";
import {
  getOrCreateDatabase,
  removeRegistrationOptions,
  saveRegistrationOptions,
} from "./database";

export const getRegistrationOptions = async (
  ephemeralWalletAddress: string
): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  const challenge = await bcrypt.hash(ephemeralWalletAddress, 10);

  const registrationOptionsParameters: GenerateRegistrationOptionsOpts = {
    rpName: "Passkeys TACo PoC",
    rpID: "localhost",
    userName: ephemeralWalletAddress, // to be shown in passkey popup
    userID: isoUint8Array.fromASCIIString(ephemeralWalletAddress),
    challenge: isoUint8Array.fromASCIIString(challenge),
    userDisplayName: ephemeralWalletAddress,
    timeout: 60000,
    // excludeCredentials: [],
    supportedAlgorithmIDs: [-7, -257],
  };

  const registrationOptions = await generateRegistrationOptions(
    registrationOptionsParameters
  );

  // Registration options are saved in the database for later verification
  saveRegistrationOptions(registrationOptions);

  return registrationOptions;
};

export const verifyRegistration = async (
  ephemeralWalletAddress: string,
  registrationResponse: RegistrationResponseJSON
): Promise<VerifiedRegistrationResponse> => {
  const db = await getOrCreateDatabase();

  let verificationResponse;

  if (registrationResponse == null) {
    throw new Error("Invalid credentials");
  }

  const challenge = db.registrationOptions[ephemeralWalletAddress].challenge;

  if (!challenge) {
    throw new Error(
      "No challenge found for this ephemeral wallet address in DB"
    );
  }

  // Check the ephemeral wallet address provided againt the challenge in DB
  const challengeCheck = await bcrypt.compare(
    ephemeralWalletAddress,
    isoBase64URL.toUTF8String(challenge)
  );
  if (!challengeCheck) {
    throw new Error("Challenge verification failed");
  }

  try {
    verificationResponse = await verifyRegistrationResponse({
      response: registrationResponse,
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

  removeRegistrationOptions(ephemeralWalletAddress);

  return verificationResponse;
};
