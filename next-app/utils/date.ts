export function getDistance(expDate: Date): { text: string, num: number } {

  const now = new Date().getTime();
  const distance = expDate.getTime() - now;

  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { text: hours > 0 ? `${hours}h ` : "" + `${minutes}m ${seconds}s`, num: distance }
}
