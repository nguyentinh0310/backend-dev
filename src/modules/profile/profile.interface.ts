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
  from: Date;
  to: Date;
  current: boolean;
}
export interface IEducation {
  _id: string;
  school: string;
  from: Date;
  to: Date;
  current: boolean;
}

export interface ISocial extends Record<string, string> {
  twitter: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  github: string;
}
