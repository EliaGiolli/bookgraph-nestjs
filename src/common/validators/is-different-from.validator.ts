import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Cross-property inequality check. Implemented as a real constraint rather than
// a @ValidateIf callback: a callback that throws escapes the validation pipe as
// an unhandled error (500) instead of becoming a 400 with a field message.
@ValidatorConstraint({ name: 'isDifferentFrom', async: false })
export class IsDifferentFromConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, unknown>)[relatedProperty];

    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedProperty] = args.constraints as [string];

    return `${args.property} must be different from ${relatedProperty}`;
  }
}

export function IsDifferentFrom(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isDifferentFrom',
      target: object.constructor,
      propertyName,
      constraints: [relatedProperty],
      options: validationOptions,
      validator: IsDifferentFromConstraint,
    });
  };
}
