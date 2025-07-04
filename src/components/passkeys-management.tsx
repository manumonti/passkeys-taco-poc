"use client";

import RegisterPasskey from "../components/register-button";
import AuthenticatePasskey from "../components/authenticate-button";
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
