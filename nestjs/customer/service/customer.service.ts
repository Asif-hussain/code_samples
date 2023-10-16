import { Injectable, Inject } from '@nestjs/common'
import { BaseService } from '../../shared/service/base.service'
import { ConfigService } from '../../shared/config/config.service'
import { User } from '../../users/model/user.model'
import { CloudStorageService } from '../../shared/service/cloudStorage.service';
import { QueryTypes } from 'sequelize';
import { HelperService } from '../../shared/service/helper.service';

@Injectable()
export class CustomerService extends BaseService {
  private readonly jwtPrivateKey: string

  constructor (
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private readonly configService: ConfigService,
  private readonly cloudStorage: CloudStorageService
  ) {
    super()
    this.jwtPrivateKey = this.configService.jwtConfig.privateKey
  }

  async calculateStorage () {
    const users = await this.userRepository.findAll<User>({
      where: { deletedAt: null }
    })
    let size = 0
    for (const usersKey in users) {
      size = 0
      const datasetsIds = await this.userRepository.sequelize.query('SELECT dataset_id from dataset_users where user_id = :userId AND deleted_at is null AND role = \'owner\' ',
        {
          replacements: { userId: users[usersKey].id },
          type: QueryTypes.SELECT
        })

      if (datasetsIds.length) {
        for (const datasetsIdsKey in datasetsIds) {
          // @ts-ignore
          const storageSize = await this.cloudStorage.prop.getBucketFolderSize(this.cloudStorage.publicBucket, 'datasets/' + datasetsIds[datasetsIdsKey].dataset_id)
          size = size + Number(storageSize)
          const gbSize = await HelperService.bytesToGB(size)
          await this.userRepository.sequelize.query('UPDATE users SET storage_used = :gbSize WHERE id = :userId', {
            replacements: { userId: users[usersKey].id, gbSize }
          })
        }
      }
    }

  }
}
