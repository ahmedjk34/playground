class CacheProvider {
  constructor() {}

  get(key) {
    throw new Error("The GET method must be implemented");
  }
  set(key, value, ttlSeconds) {
    throw new Error("The SET method must be implemented");
  }
  delete(key) {
    throw new Error("The DELETE method must be implemented");
  }
  clear() {
    throw new Error("The CLEAR method must be implemented");
  }

  stats() {
    throw new Error("The STATS method must be implemented");
  }
}

module.exports = CacheProvider;
