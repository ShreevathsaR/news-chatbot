import { useEffect } from "react";
import ChatScreen from "./screens/ChatScreen";
import { getQueries } from "./lib/api/queries";
import { queryStore } from "./lib/contexts/queryStore";
import { useSocket } from "./hooks/useSockets";

const App = () => {
  const setQueries = queryStore((state) => state.setQueries);
  const setSelectedQuery = queryStore((state) => state.setSelectedQuery);
  const userId = JSON.parse(localStorage.getItem("user") || "null")?.id;
  const { notifications, clearNotifications } = useSocket(userId);

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
      <ChatScreen notifications={notifications} clearNotifications={clearNotifications} />
    </div>
  );
};

export default App;
