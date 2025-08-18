import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { queryStore } from "@/lib/contexts/queryStore";

const CreateQueryModal = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const addQuery = queryStore((state) => state.addQuery);
  const setSelectedQuery = queryStore((state) => state.setSelectedQuery);
  async function handleCreateQuery() {
    if (!query) {
      return toast.error("Please enter a valid query");
    }

    try {
      const response = await api.post("/query", { query });

      if (response.data.success) {
        toast.success("Query created successfully");
        addQuery(response.data.data);
        setOpen(false);
        setSelectedQuery(response.data.data);
      } else {
        toast.error("Failed to create query");
      }
    } catch (error) {
      toast.error("Failed to create query");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4" />
          New Query
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Query</DialogTitle>
          <DialogDescription>
            Create a new query to search for news articles.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
        />
        <Button onClick={() => handleCreateQuery()}>Create</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQueryModal;
