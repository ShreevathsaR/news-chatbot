import { useEffect } from "react";
import ChatScreen from "./screens/ChatScreen";
import { getQueries } from "./lib/api/queries";
import { queryStore } from "./lib/contexts/queryStore";

const App = () => {
  const setQueries = queryStore((state) => state.setQueries);
  const setSelectedQuery = queryStore((state) => state.setSelectedQuery);

  useEffect(() => {
    const fetchQueries = async () => {
      const queries = await getQueries();
      setQueries(queries);
      setSelectedQuery(queries[0]);
    };
    fetchQueries();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatScreen />
    </div>
  );
};

export default App;
