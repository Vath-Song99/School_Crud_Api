import { randomBytes } from "crypto";

export function generateEmailVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateExpireTime(): Date {
  const curentTime = new Date();
  curentTime.setSeconds(curentTime.getSeconds() + 60);
  return curentTime;
}
