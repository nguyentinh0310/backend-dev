export default class CreateProfileDto {
  constructor(
    location: string,
    bio: string,
    skills: string,
    twitter: string,
    instagram: string,
    linkedin: string,
    facebook: string,
    github: string
  ) {
    this.location = location;
    this.bio = bio;
    this.skills = skills;
    this.twitter = twitter;
    this.instagram = instagram;
    this.linkedin = linkedin;
    this.facebook = facebook;
    this.github = github
  }

  public location: string;
  public bio: string;
  public skills: string;
  public twitter: string;
  public instagram: string;
  public linkedin: string;
  public facebook: string;
  public github: string;
}
