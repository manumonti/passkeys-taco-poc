"use server";

// This is mocking a database using a JSON file for simplicity

import { existsSync, writeFileSync, readFileSync } from "fs";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

const DB_FILE = "./database.json";

export const getOrCreateDatabase = async () => {
  if (!existsSync(DB_FILE)) {
    writeFileSync(
      DB_FILE,
      JSON.stringify({ registrationOptions: {} }, null, 2)
    );
  }
  const db = readFileSync(DB_FILE, { encoding: "utf8" });
  return JSON.parse(db);
};

export const saveRegistrationOptions = async (
  registrationOptions: PublicKeyCredentialCreationOptionsJSON
) => {
  const db = await getOrCreateDatabase();
  const userID = isoBase64URL.toUTF8String(registrationOptions.user.id);
  db.registrationOptions[userID] = registrationOptions;
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

export const removeRegistrationOptions = async (userID: string) => {
  const db = await getOrCreateDatabase();
  delete db.registrationOptions[userID];
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};
