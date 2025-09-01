export function generateOtpCode(): string {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log(otp);
  return otp;
}
