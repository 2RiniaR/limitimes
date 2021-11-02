import { User } from "src/models/user";

export class Follow {
  private _followingUser?: User;
  private _followedUser?: User;

  get followingUser(): User | undefined {
    return this._followingUser;
  }

  set followingUser(value: User | undefined) {
    this._followingUser = value;
  }

  get followedUser(): User | undefined {
    return this._followedUser;
  }

  set followedUser(value: User | undefined) {
    this._followedUser = value;
  }
}
