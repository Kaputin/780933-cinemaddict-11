export default class Comment {
  constructor(data) {

    this.id = data[`id`];
    this.emoji = data[`emotion`];
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = data[`date`];
  }

  commentToRAW() {
    return {
      "comment": this.comment,
      "date": this.date.toISOString(),
      "emotion": this.emotion,
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comments) {
    return comments.map(Comment.parseComment);
  }
}
