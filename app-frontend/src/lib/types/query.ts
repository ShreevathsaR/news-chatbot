export interface Query {
  query: string;
  createdAt: string;
  id: number;
  userId: number;
}

export interface QueryStore {
  queries: Query[] | null;
  setQueries: (queries: Query[]) => void;
  selectedQuery: Query | null;
  setSelectedQuery: (query: Query) => void;
  addQuery: (query: Query) => void;
  removeQuery: (id: number) => void;
  clearQueries: () => void;
}
