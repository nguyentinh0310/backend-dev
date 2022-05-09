
export default class CreatePostDto {
  constructor(content: string, images: string[]) {
    this.content = content;
    this.images = images;
  }

  public content: string;
  
  public images: string[];
}
