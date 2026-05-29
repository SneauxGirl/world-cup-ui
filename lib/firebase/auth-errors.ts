import { FirebaseError } from "firebase/app";
import { t } from "@/lib/i18n/t";

export type AuthErrorField = "firstName" | "lastName" | "email" | "password" | "form";

export type AuthErrorDisplay = {
  message: string;
  field: AuthErrorField;
};

const fieldByCode: Partial<Record<string, AuthErrorField>> = {
  "auth/invalid-email": "email",
  "auth/missing-email": "email",
  "auth/weak-password": "password",
};

function messageKeyForCode(code: string, mode: "signIn" | "signUp"): string {
  switch (code) {
    case "auth/invalid-email":
      return "login.authErrors.invalidEmail";
    case "auth/missing-email":
      return "login.authErrors.missingEmail";
    case "auth/weak-password":
      return "login.authErrors.weakPassword";
    case "auth/email-already-in-use":
      return "login.authErrors.emailAlreadyInUse";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return mode === "signUp"
        ? "login.authErrors.signUpFailed"
        : "login.authErrors.invalidCredentials";
    case "auth/too-many-requests":
      return "login.authErrors.tooManyRequests";
    case "auth/network-request-failed":
      return "login.authErrors.network";
    default:
      return "login.authErrors.generic";
  }
}

export function getAuthErrorDisplay(
  error: unknown,
  mode: "signIn" | "signUp",
): AuthErrorDisplay {
  const code =
    error instanceof FirebaseError
      ? error.code
      : typeof error === "object" &&
          error !== null &&
          "code" in error &&
          typeof (error as { code: unknown }).code === "string"
        ? (error as { code: string }).code
        : null;

  if (code) {
    return {
      message: t(messageKeyForCode(code, mode)),
      field: fieldByCode[code] ?? "form",
    };
  }

  return {
    message: t("login.authErrors.generic"),
    field: "form",
  };
}
