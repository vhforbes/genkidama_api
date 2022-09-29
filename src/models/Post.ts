import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid";

@Entity("posts")
class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  date: Date;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column()
  image: string;

  @Column()
  video: string;
}

export default Post;
