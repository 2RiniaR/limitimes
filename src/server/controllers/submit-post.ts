type RequestSubmitPostContext = {
  userId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requestSubmitPost(context: RequestSubmitPostContext) {
  // ToDo: 投稿を送信する
  // DMに送られたメッセージと同じ内容を、ストリームチャンネルにEmbedで送信する
  // 投稿したユーザーをフォローしているユーザーのDMに、ストリームチャンネルに送信した投稿の引用をSendQuoteで送信する
  // 送信完了のメッセージを投稿したユーザーとのDMに送信する
}