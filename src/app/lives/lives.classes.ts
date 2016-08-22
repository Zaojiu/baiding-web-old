import { LiveStatus } from './lives.enums';
import { User } from '../base/user.class';

export class Live {
  id: number;
  title: string;
  status: LiveStatus;
  user: User;
}
