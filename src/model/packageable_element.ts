import { Package } from '..';

export interface PackageableElement {
  get container(): Package | undefined ;
  set container(newContainer: Package | undefined);
}
