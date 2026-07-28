const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return localStorage.getItem(_key);
    },
    setItem(_key: string, value: string) {
      return localStorage.setItem(_key, value);
    },
    removeItem(_key: string) {
      return localStorage.removeItem(_key);
    }
  };
};

const storage = typeof window !== 'undefined' ? createNoopStorage() : null;

export default storage;
