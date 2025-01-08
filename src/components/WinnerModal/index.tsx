type WinnerModalProps = {
  winner: string;
  onGotoLobbyClick: () => void;
};

const WinnerModal = ({ winner, onGotoLobbyClick }: WinnerModalProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", color: "white", marginBottom: 10 }}>
          Winner: {winner}
        </div>
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100px",
            height: "30px",
          }}
          onClick={onGotoLobbyClick}
        >
          Go to Lobby
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
