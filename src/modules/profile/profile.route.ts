import { Route } from "@core/interfaces";
import { authAdmin, authMiddleware, validationMiddleware } from "@core/middlewares";
import { Router } from "express";
import AddEducationDto from "./dtos/add_education.dto";
import AddExperienceDto from "./dtos/add_experience.dto";
import CreateProfileDto from "./dtos/create-profile.dtos";
import ProfileController from "./profile.controller";

class ProfileRoute implements Route {
  public path = "/api/v1/profile";
  public router = Router();
  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, authAdmin, this.profileController.getAllProfiles)
    this.router.get(`${this.path}/me`, authMiddleware, this.profileController.getCurrentProfile)
    this.router.post(`${this.path}`, validationMiddleware(CreateProfileDto), authMiddleware, this.profileController.ceateProfile)
    this.router.get(`${this.path}/:id`, authMiddleware, this.profileController.getProfileByUserId)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.profileController.deleteProfile)
    this.router.put(`${this.path}/experience`,validationMiddleware(AddExperienceDto), authMiddleware, this.profileController.createExperience)
    this.router.put(`${this.path}/experience/:id`, authMiddleware, this.profileController.deleteExperience)

    this.router.put(`${this.path}/education`,validationMiddleware(AddEducationDto), authMiddleware, this.profileController.createEducation)
    this.router.put(`${this.path}/education/:id`, authMiddleware, this.profileController.deleteEducation)
  }
}

export default ProfileRoute;
