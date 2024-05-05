import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'validityFormat', async: false })
export class ValidityFormatValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    const validity = value.toLowerCase();
    // Regex to match the format: <number> days|hours|minutes
    const validityPattern = /^(\d+)\s*(days?|hours?|minutes?)$/;

    if (!validityPattern.test(validity)) {
      return false;
    }

    const [, numStr, unit] = validity.match(validityPattern);

    const number = parseInt(numStr, 10);

    switch (unit) {
      case 'days':
      case 'day':
        return number >= 1 && number <= 7;
      case 'hours':
      case 'hour':
        return number >= 1 && number <= 23;
      case 'minutes':
      case 'minute':
        return number >= 1 && number <= 59;
      default:
        return false;
    }
  }

  defaultMessage() {
    return 'Validity should be in the format <number> days|hours|minutes, where number is between 1 and 7 for days, 1 and 23 for hours, and 1 and 59 for minutes.';
  }
}
