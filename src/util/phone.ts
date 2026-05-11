export function sanitizePhone(tel: string) {
  tel = tel.replaceAll(/\D/g, "");
  if (tel.startsWith("0")) {
    tel = `+49${tel.slice(1)}`;
  }
  return tel;
}
