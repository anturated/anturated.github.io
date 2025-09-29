"use client"

import { getDistance } from "@/utils/date";
import { useEffect, useState } from "react";

export default function Timer({ expiry }: { expiry: Date | undefined }) {
  const expDate = new Date(expiry ?? Date());

  const [timeLeft, setTimeLeft] = useState<string>(getDistance(expDate).text);

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = getDistance(expDate);

      if (distance.num <= 0) {
        clearInterval(interval);
        setTimeLeft("Expired");
        return;
      }

      setTimeLeft(distance.text);

    }, 1000);

    return () => clearInterval(interval);

  }, [expDate]);

  return <span>
    {timeLeft}
  </span>

}
