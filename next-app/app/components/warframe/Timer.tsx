import { useEffect, useState } from "react";

export default function Timer({ expiry }: { expiry: Date | undefined }) {
  const [timeLeft, setTimeLeft] = useState<string>("???");

  const expDate = new Date(expiry ?? Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(hours > 0 ? `${hours}h ` : "" + `${minutes}m ${seconds}s`);

    }, 1000);

    return () => clearInterval(interval);

  }, [expDate]);

  return <span>
    {timeLeft}
  </span>

}
