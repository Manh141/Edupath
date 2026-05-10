import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsIn,
} from 'class-validator';
import { ROLES } from '../../../common/constants/role.constants';

export class GrantRolesDto {
  @IsEmail()
  email!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn([ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN], { each: true })
  roles!: string[];
}
