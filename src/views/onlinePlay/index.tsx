import { useNavigate, useSearchParams } from "react-router";
import useStores from "../../hooks/useStores";
import Play from "../../components/Play";
import { observer } from "mobx-react";

const OnlinePlay = () => {
  const stores = useStores();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  if (!stores.onlineModerators.isExist()) {
    const centralPeerId = searchParams.get("room");
    navigate(`/lobby?room=${centralPeerId}`);
    return <></>;
  }
  const moderator = stores.onlineModerators.get(0);
  return <Play playerIdx={moderator.playerIdx} moderator={moderator} />;
};

export default observer(OnlinePlay);
