import { create } from "zustand";
import { Query, QueryStore } from "../types/query";

export const queryStore = create<QueryStore>((set) => ({
  queries: [],
  setQueries: (queries: Query[]) => set({ queries }),
  selectedQuery: null,
  setSelectedQuery: (query: Query) => set({ selectedQuery: query }),
  addQuery: (query: Query) =>
    set((state) => ({ queries: [...(state.queries || []), query] })),
  removeQuery: (id: number) =>
    set((state) => ({
      queries: state.queries?.filter((query) => query.id !== id) || [],
      selectedQuery: state.queries ? (state.queries.length > 0 ? state.queries[0] : null) : null
    })),
  clearQueries: () => set({ queries: null }),
}));
