import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { Plan } from '../model/plan';
import { UserPlan } from '../model/user.plan';
import { UserPlanDto } from '../dto/user.plan.dto';
import { PlanDto } from '../dto/plan.dto';

@Injectable()
export class PlanService extends BaseService {
  constructor (
        @Inject('PLAN_REPOSITORY')
        private planRepository: typeof Plan,
        @Inject('USER_PLAN_REPOSITORY')
        private userPlanRepository: typeof UserPlan
  ) {
    super()
  }

  // get plan
  async getPlan (userId) {
    const userPlan = await this.userPlanRepository.findOne<UserPlan>({
      where: { userId, completed: false }
    })

    return new UserPlanDto(userPlan)
  }

  // check for plan
  async checkProject (userId) {
    const userPlan = await this.userPlanRepository.findOne<UserPlan>({
      where: { userId, completed: false }
    })

    if (userPlan && userPlan.privateProjectRemaining > 0) {
      userPlan.privateProjectRemaining = userPlan.privateProjectRemaining - 1
      await this.checkPlanStatus(userPlan.id)
      await userPlan.save()
      return true
    }

    return false
  }

  // for training
  async checkTraining (userId) {
    const userPlan = await this.userPlanRepository.findOne<UserPlan>({
      where: { userId, completed: false }
    })

    if (userPlan && userPlan.trainingRemaining > 0) {
      userPlan.trainingRemaining = userPlan.trainingRemaining - 1
      await this.checkPlanStatus(userPlan.id)
      await userPlan.save()
      return true
    }

    return false
  }

  // for inference
  async checkInference (userId) {
    const userPlan = await this.userPlanRepository.findOne<UserPlan>({
      where: { userId, completed: false }
    })

    if (userPlan && userPlan.inferencesRemaining > 0) {
      userPlan.inferencesRemaining = userPlan.inferencesRemaining - 1
      await this.checkPlanStatus(userPlan.id)
      await userPlan.save()
      return true
    }

    return false
  }

  // check if plan completed
  async checkPlanStatus (planId) {
    const userPlan = await this.userPlanRepository.findOne<UserPlan>({
      where: { id: planId }
    })

    // eslint-disable-next-line eqeqeq
    if (userPlan.privateProjectRemaining == 0 && userPlan.inferencesRemaining == 0 && userPlan.trainingRemaining == 0) {
      userPlan.completed = true
      await userPlan.save()
    }

    return true
  }

  // get user plan
  async getOne (userId) {
    const userPlan = await this.userPlanRepository.findOne<UserPlan>({
      where: { userId, completed: false }
    })

    return new UserPlanDto(userPlan)
  }

  // get one plan
  async getOnePlan (id) {
    const plan = await this.planRepository.findOne<Plan>({
      where: { id }
    })

    return new PlanDto(plan)
  }
}
