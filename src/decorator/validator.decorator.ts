import { Injectable } from '@nestjs/common';
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
  public propertyName: string;
  async validate(value: any) {
    const repository = getRepository(this.table);
    const data = await repository.findOne({
      [this.propertyName]: value,
    });
    return !data;
  }

  defaultMessage(args: ValidationArguments) {
    const { property } = args;
    return `${property} is already used`;
  }
}

export function NotExistIn(
  table: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    NotExistInRule.prototype.table = table;
    NotExistInRule.prototype.propertyName = propertyName;
    registerDecorator({
      name: 'NotExistIn',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistInRule,
    });
  };
}
