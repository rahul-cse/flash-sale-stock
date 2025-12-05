import React, { useEffect, useState } from "react";

function ReservationTimer({ expiresAt, onExpired  }) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      const s = Math.max(0, Math.floor(diff / 1000));
      setSecondsLeft(s);
      if (s <= 0) {
        clearInterval(interval);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);


  return <div>Expires in: {secondsLeft}s</div>;
}

export default ReservationTimer;
