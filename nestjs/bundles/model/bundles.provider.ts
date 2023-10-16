import { Bundles } from './bundles.model';
import { UserBundle } from './user-bundle.model';

export const bundlesProviders = [
  {
    provide: 'BUNDLES_REPOSITORY',
    useValue: Bundles
  },
  {
    provide: 'USER_BUNDLE_REPOSITORY',
    useValue: UserBundle
  }
]
