import { HttpException } from "@core/exceptions";
import { ListResponse } from "@core/interfaces";
import { IUser, UserSchema } from "@modules/users";
import normalize from "normalize-url";
import AddEducationDto from "./dtos/add_education.dto";
import AddExperienceDto from "./dtos/add_experience.dto";
import CreateProfileDto from "./dtos/create-profile.dtos";
import { IEducation, IExperience, IProfile, ISocial } from "./profile.interface";
import ProfileSchema from "./profile.model";

class ProfileService {
  public profileSchema = ProfileSchema;
  public userSchema = UserSchema;

  public async getCurrentProfile(userId: string): Promise<Partial<IProfile>> {
    const user: any = await this.profileSchema
      .findOne({
        user: userId,
      })
      .populate("user", ["fullname", "avatar"])
      .exec();
    if (!user) {
      throw new HttpException(400, "There is no profile for this user");
    }
    return user;
  }

  public async createProfile(userId: string, profileDto: CreateProfileDto): Promise<IProfile> {
    const { location, bio, skills, twitter, instagram, linkedin, facebook, github } =
      profileDto;

    const profileFields: Partial<IProfile> = {
      user: userId,
      location,
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill: string) =>  skill.trim()),
    };

    const socialFields: ISocial = {
      twitter,
      instagram,
      linkedin,
      facebook,
      github,
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0) {
        socialFields[key] = normalize(value, { forceHttps: true });
      }
    }

    profileFields.socail = socialFields;

    const profile = await ProfileSchema.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return profile;
  }

  public async getAllProfiles(): Promise<ListResponse<IProfile>> {
    const profiles: any = await this.profileSchema
      .find()
      .populate("user", ["fullname", "avatar"])
      .exec();
    const rowCount = await this.profileSchema.countDocuments().exec();

    return {
      data: profiles,
      totalRows: rowCount,
    };
  }

  public async getProfileByUserId(userId: string): Promise<IProfile> {
    const profile = await this.profileSchema.findOne({ user: userId }).exec();
    if (!profile) {
      throw new HttpException(404, `Profile is not exists`);
    }
    return profile;
  }

  public async deleteProfile(userId: string) {
    // Remove profile
    await this.profileSchema.findOneAndRemove({ user: userId }).exec();
  }

  public async addExperience(userId: string, experienceDto: AddExperienceDto): Promise<IProfile> {
    const newEpx = { ...experienceDto };
    const profile = await this.profileSchema.findOne({ user: userId }).exec();
    if (!profile) throw new HttpException(400, "There is not profile for this user");
    profile.experiences.unshift(newEpx as IExperience);
    await profile.save();

    return profile;
  }

  public async deleteExperience(userId: string, experienceId: string) {
    const profile = await this.profileSchema.findOne({ user: userId }).exec();
    if (!profile) throw new HttpException(400, "There is not profile for this user");

    profile.experiences = profile.experiences.filter((exp) => exp._id.toString() !== experienceId);
    await profile.save();
  }

  public async addEducation(userId: string, education: AddEducationDto): Promise<IProfile> {
    const newEducation = { ...education };
    const profile = await this.profileSchema.findOne({ user: userId }).exec();
    if (!profile) throw new HttpException(400, "There is not profile for this user");
    profile.educations.unshift(newEducation as IEducation);
    await profile.save();

    return profile;
  }

  public async deleteEducation(userId: string, educationId: string) {
    const profile = await this.profileSchema.findOne({ user: userId }).exec();
    if (!profile) throw new HttpException(400, "There is not profile for this user");

    profile.educations = profile.educations.filter((edu) => edu._id.toString() !== educationId);
    await profile.save();
  }
}

export default ProfileService;
