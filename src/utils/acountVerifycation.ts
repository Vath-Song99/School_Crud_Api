import { randomBytes } from "crypto";

export function generateEmailVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateExpireTime(): Date {
  const currentTime = new Date();
  const expireTime = new Date(currentTime.getTime()); // Clone the current time
  expireTime.setSeconds(expireTime.getSeconds() + 10); // Add 60 seconds to the cloned time
  return expireTime;
}

