import { UserRepository } from '@/repository';
import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';

export function Same(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: propertyName,
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'NotExistIn', async: true })
@Injectable()
export class NotExistInRule implements ValidatorConstraintInterface {
  public table: string;
  async validate() {
    const repository = getRepository(this.table);
    const data = await repository.find(1);
    console.log(data);
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'X';
  }
}

export function NotExistIn(
  table: string,
  validationOptions?: ValidationOptions,
) {
  NotExistInRule.prototype.table = table;
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'NotExistIn',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistInRule,
    });
  };
}
