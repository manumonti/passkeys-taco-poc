"use server";

import {
  generateAuthenticationOptions,
  GenerateAuthenticationOptionsOpts,
  verifyAuthenticationResponse,
  type PublicKeyCredentialRequestOptionsJSON,
  type VerifiedAuthenticationResponse,
  type AuthenticationResponseJSON,
  WebAuthnCredential,
} from "@simplewebauthn/server";

export const getAuthenticationOptions =
  async (): Promise<PublicKeyCredentialRequestOptionsJSON> => {
    const authenticationOptionsParameters: GenerateAuthenticationOptionsOpts = {
      rpID: "localhost",
      timeout: 60000,
      userVerification: "preferred",
    };
    const authenticationOptions = await generateAuthenticationOptions(
      authenticationOptionsParameters
    );
    return authenticationOptions;
  };

export const verifyAuthentication = async (
  authenticationResponse: AuthenticationResponseJSON,
  challenge: string,
  credential: WebAuthnCredential
): Promise<VerifiedAuthenticationResponse> => {
  const verificationResponse = await verifyAuthenticationResponse({
    response: authenticationResponse,
    expectedChallenge: challenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    credential: credential,
  });

  if (!verificationResponse.verified) {
    throw new Error("Authentication verification failed");
  }

  return verificationResponse;
};
