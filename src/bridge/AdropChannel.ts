
export class AdropChannel {
  static methodChannel = "io.adrop.adrop-ads";
  static methodBannerChannel = `${this.methodChannel}/banner`;

  static methodBannerChannelOf = (id: number) =>  `${this.methodBannerChannel}_${id}`;
}
