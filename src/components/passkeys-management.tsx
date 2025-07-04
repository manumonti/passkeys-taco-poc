"use client";

import RegisterPasskey from "../components/register-passkey";
import AuthenticatePasskey from "../components/authenticate-passkey";
import { Fragment, useState } from "react";
import { type WebAuthnCredential } from "@simplewebauthn/server";

export default function PasskeysManagement() {
  // This is replacing a DB where the user credential would be stored
  const [userCredential, setUserCredential] =
    useState<WebAuthnCredential | null>(null);

  return (
    <Fragment>
      <RegisterPasskey setUserCredential={setUserCredential} />
      <AuthenticatePasskey userCredential={userCredential} />
    </Fragment>
  );
}
