import { Post } from ".";

export class User {
  public discord_id: number;
  public preservedPost: Post | null = null;

  constructor(discord_id: number) {
    this.discord_id = discord_id;
  }
}
