export const filterStores = (stores: any, query: any) => {
  return stores.filter((store: any) =>
    store.name.toLowerCase().includes(query.toLowerCase()),
  );
};
