const CacheProvider = require("./CacheProvider");

const MAX_CACHE_ITEMS = 100;

class MemoryCache extends CacheProvider {
  map;
  constructor() {
    super();
    this.map = new Map();
    console.log("Memory Cache is Created");
  }
  get(key) {
    const item = this.map.get(key);
    if (item == undefined || item.expiresAt < Date.now()) return false;
    else return item;
  }
  set(key, value, ttlSeconds) {
    if (this.map.size == MAX_CACHE_ITEMS) this.evict();

    this.map.set(key, {
      value: value,
      expiresAt: Date.now() + ttlSeconds * 1000, //Date.now() returns time in millisecond
      lastAccessed: null,
      hitCount: 0,
    });
  }

  delete(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  //LRU evection
  evict() {
    let keyForItemToEvict = null;
    let currentItemLastAccessed;
    let currentItemToEvictLastAccessed;
    this.map.forEach((value, key) => {
      if (keyForItemToEvict == null) {
        keyForItemToEvict = key;
      }
      currentItemLastAccessed = value.lastAccessed.getTime();
      currentItemToEvictLastAccessed = this.map
        .get(keyForItemToEvict)
        .lastAccessed.getTime();

      if (currentItemLastAccessed < currentItemLastAccessed)
        keyForItemToEvict = key;
    });
    this.map.delete(keyForItemToEvict);
  }
}

module.exports = MemoryCache;
