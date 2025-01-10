import styles from "./Timer.module.scss";
import { useEffect, useState } from "react";

type TimerProps = {
  initialSeconds: number;
  onTimeout?: () => void;
};

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remains = seconds - minutes * 60;
  return `${minutes.toString().padStart(2, "0")}:${remains
    .toString()
    .padStart(2, "0")}`;
};

const Timer = ({ initialSeconds, onTimeout }: TimerProps) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      onTimeout && onTimeout();
    }
  }, [seconds, onTimeout]);

  return <span className={styles["timer"]}>{formatSeconds(seconds)}</span>;
};

export default Timer;
