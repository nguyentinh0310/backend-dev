export interface IProfile {
  _id: string;
  user: string;
  location: string;
  skills: string[];
  bio: string;
  experiences: IExperience[];
  educations: IEducation[];
  socail: ISocial;
}

export interface IExperience {
  _id: string;
  title: string;
  company: string;
  location: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}
export interface IEducation {
  _id: string;
  school: string;
  fieldofstudy: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface ISocial extends Record<string, string> {
  youtube: string;
  twitter: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  github: string;
}
