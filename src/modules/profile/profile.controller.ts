import { NextFunction, Request, Response } from "express";
import AddEducationDto from "./dtos/add_education.dto";
import AddExperienceDto from "./dtos/add_experience.dto";
import { IProfile } from "./profile.interface";
import ProfileService from "./profile.service";

export default class ProfileController {
  private profileService = new ProfileService();

  public getCurrentProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const resultObj = await this.profileService.getCurrentProfile(userId);
      res.status(200).json(resultObj);
    } catch (error) {
      next(error);
    }
  };

  public ceateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.body;
      const userId = req.user.id;
      const createUserData: IProfile = await this.profileService.createProfile(
        userId,
        userData
      );
      res.status(201).json({ data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public getAllProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resultObj = await this.profileService.getAllProfiles();
      res.status(200).json(resultObj);
    } catch (error) {
      next(error);
    }
  };

  public getProfileByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const profile = await this.profileService.getProfileByUserId(userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      await this.profileService.deleteProfile(userId);
      res.status(200).json({ message: "Delete profile successfully" });
    } catch (error) {
      next(error);
    }
  };

  public createExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: AddExperienceDto = req.body;
      const userId = req.user.id;
      const profile = await this.profileService.addExperience(userId, model);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public deleteExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const expId = req.params.id;
      const userId = req.user.id;
      await this.profileService.deleteExperience(userId, expId);
      res.status(200).json({ message: "Delete experience successfully" });
    } catch (error) {
      next(error);
    }
  };

  public createEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: AddEducationDto = req.body;
      const userId = req.user.id;
      const profile = await this.profileService.addEducation(userId, model);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public deleteEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const eduId = req.params.id;
      const userId = req.user.id;
      await this.profileService.deleteEducation(userId, eduId);
      res.status(200).json({ message: "Delete experience successfully" });
    } catch (error) {
      next(error);
    }
  };
}
