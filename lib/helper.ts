export function isBerkeleyEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@berkeley\.edu$/;
  return regex.test(email);
}
