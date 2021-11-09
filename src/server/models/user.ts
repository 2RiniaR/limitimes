import { repository } from "src/server/repositories";

export interface UsersRepository {
  exists(id: string): Promise<boolean>;
  push(user: User): Promise<void>;
  pull(user: User): Promise<void>;
  getFollowers(user: User): Promise<User[]>;
}

export class FollowingSelfError extends Error {}
export class NotFoundError extends Error {}
export class AlreadyFollowedError extends Error {}
export class AlreadyExistError extends Error {}
export class UnfollowTargetNotFoundError extends Error {}

export class User {
  public readonly id: string;
  private _followings?: User[];

  constructor(id: string) {
    this.id = id;
  }

  public exists(): Promise<boolean> {
    return repository.exists(this.id);
  }

  public async update() {
    if (!(await this.exists())) throw new NotFoundError();
    await repository.push(this);
  }

  public async create() {
    if (await this.exists()) throw new AlreadyExistError();
    this._followings = [];
    await repository.push(this);
  }

  public async fetch() {
    if (!(await this.exists())) throw new NotFoundError();
    await repository.pull(this);
  }

  private isSame(target: User): boolean {
    return this.id === target.id;
  }

  private isFollowing(target: User): boolean {
    if (!this._followings) throw Error("require properties are undefined.");
    return !!this._followings.find((user) => user.id === target.id);
  }

  public follow(target: User) {
    if (!this._followings) throw Error("require properties are undefined.");
    if (this.isSame(target)) throw new FollowingSelfError();
    if (this.isFollowing(target)) throw new AlreadyFollowedError();
    this._followings.push(target);
  }

  public unfollow(target: User) {
    if (!this._followings) throw Error("require properties are undefined.");
    if (!this.isFollowing(target)) throw new UnfollowTargetNotFoundError();
    this._followings = this._followings.filter((user) => user.id !== target.id);
  }

  get followings(): User[] | undefined {
    return this._followings;
  }

  public async getFollowers(): Promise<User[]> {
    return await repository.getFollowers(this);
  }
}
