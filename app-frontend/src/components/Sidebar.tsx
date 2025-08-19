import { queryStore } from "@/lib/contexts/queryStore";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import CreateQueryModal from "./CreateQueryModal";
import api from "@/lib/api";
import { toast } from "sonner";

const Sidebar = () => {
  const queries = queryStore((state) => state.queries);
  const setSelectedQuery = queryStore((state) => state.setSelectedQuery);
  const selectedQuery = queryStore((state) => state.selectedQuery);
  const deleteQuery = queryStore((state) => state.removeQuery);

  async function handleDeleteQuery(id: number) {
    try {
      const response = await api.delete(`/query/${id}`);
      if (response.data.success) {
        toast.success("Query deleted successfully");
        deleteQuery(id);
      } else {
        toast.error("Failed to delete query");
      }
    } catch (error) {
      toast.error("Failed to delete query");
      console.log(error)
    }
  }

  return (
    <div className="bg-white/10 w-60 h-full">
      <h4 className="p-4 bg-black/30 text-md">Queries</h4>
      <ul className="flex flex-col gap-1 p-1">
        {queries?.map((query, index) => {
          return (
            <li
              className="hover:bg-black/10 p-3 truncate flex items-center justify-between rounded-lg cursor-pointer"
              style={{
                backgroundColor:
                  selectedQuery?.id === query.id ? "black" : "transparent",
                color: selectedQuery?.id === query.id ? "white" : "inherit",
              }}
              key={index}
              onClick={() => setSelectedQuery(query)}
            >
              {query.query}
              <Button size="icon" className="ml-auto bg-transparent hover:bg-red-400" onClick={() => handleDeleteQuery(query.id)}>
                <TrashIcon color="white" className="w-4 h-4" />
              </Button>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center items-center p-4">
        <CreateQueryModal/>
      </div>
    </div>
  );
};

export default Sidebar;
