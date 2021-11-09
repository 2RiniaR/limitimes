export {};

declare global {
  interface Array<T> {
    removeNone(): Array<T extends null ? never : T extends undefined ? never : T>;
    throwNone(): Array<T extends null ? never : T extends undefined ? never : T>;
    toStringElements<T, U extends T>(): Array<U>;
  }
}

Array.prototype.removeNone = function <T>(this: Array<T | undefined | null>): Array<T> {
  return this.filter((element) => element) as T[];
};

Array.prototype.throwNone = function <T>(this: Array<T | undefined | null>): Array<T> {
  if (this.filter((element) => !element).length > 0) throw TypeError("Some elements didn't has value");
  return this as T[];
};

Array.prototype.toStringElements = function <T, U extends T>(this: Array<T>): Array<U> {
  return this.map((element) => element as U);
};
