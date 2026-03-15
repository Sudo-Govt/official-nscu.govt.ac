// Certificate number generator for NSCU

function generateRandomId(): string {
  return "D" + Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateCertificateNumber(
  examLevel: string,
  year: string
): string {
  const prefix = examLevel.includes("XII") ? "USE" : "LSE";
  const randomId = generateRandomId();
  return `NSCU/${prefix}/${year}/${randomId}`;
}
