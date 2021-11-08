export {};

declare global {
  interface Array<T> {
    removeNone(): Array<T extends null ? never : T extends undefined ? never : T>;
    throwNone(): Array<T extends null ? never : T extends undefined ? never : T>;
  }
}

Array.prototype.removeNone = function <T>(this: Array<T | undefined | null>): Array<T> {
  return this.filter((element) => element) as T[];
};

Array.prototype.throwNone = function <T>(this: Array<T | undefined | null>): Array<T> {
  if (this.filter((element) => !element).length > 0) throw TypeError("Some elements didn't has value");
  return this as T[];
};
