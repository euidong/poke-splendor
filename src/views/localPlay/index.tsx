import { useNavigate, useSearchParams } from "react-router";
import { LocalModerator, startLocalGame } from "../../stores/game/moderator";
import useStores from "../../hooks/useStores";
import Play from "../../components/Play";

const LocalPlay = () => {
  const stores = useStores();
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const numPlayers = Number(searchParams.get("players"));
  if (numPlayers !== 2 && numPlayers !== 3 && numPlayers !== 4) {
    navigate("/poke-splendor");
    return <></>;
  }
  const { lms } = startLocalGame(numPlayers);
  stores.localModerators = lms;

  return (
    <>
      {stores.localModerators
        .getAll()
        .map((moderator: LocalModerator, idx: number) => (
          <Play key={idx} playerIdx={idx} moderator={moderator} hide={true} />
        ))}
    </>
  );
};

export default LocalPlay;
