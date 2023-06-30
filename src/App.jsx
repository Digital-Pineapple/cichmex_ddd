import { useEffect, useState } from "react";

import RoutesContainer from "./routes/RoutesContainer";
import LoadingScreen from "./components/ui/LoadingScreen";
import { useAuthStore } from "./hooks";


const App = () => {
  const { RevalidateToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(async()=>{
      await RevalidateToken();
      setLoading(false)
    }, 500)
  }, []);

  return (
    <>
    {
      loading ? <LoadingScreen /> : <RoutesContainer />
    }
    </>
  );
};

export default App;
