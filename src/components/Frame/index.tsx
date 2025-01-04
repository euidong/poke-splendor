import styles from "./Frame.module.scss";

type FrameProps = {
  children: React.ReactNode;
  debug?: boolean;
};

const Frame = ({ children, debug }: FrameProps) => {
  return (
    <div
      className={styles["frame"]}
      style={{ border: debug ? "1px solid black" : undefined }}
    >
      {children}
    </div>
  );
};

export default Frame;
