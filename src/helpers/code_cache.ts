type cacheType = {
  [key: string]: string;
};

export class CodeCache {
  private cache: cacheType = {};

  public set(key: string, value: string) {
    this.cache[key] = value;
    setTimeout(() => this.remove(key), 60000);
  };

  public get(key: string) {
    return this.cache[key];
  };

  public remove(key: string) {
    if (!this.cache[key]) return;
    delete this.cache[key];
  }
}
