import { v4 } from "uuid";

class Post {
  id: string;
  date: Date;
  author: string;
  title: string;
  content: string;

  constructor({ author, title, content }: Omit<Post, "id" | "date">) {
    this.id = v4();
    this.date = new Date();
    this.author = author;
    this.title = title;
    this.content = content;
  }
}

export default Post;
