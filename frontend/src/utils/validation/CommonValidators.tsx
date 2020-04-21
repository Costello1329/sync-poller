import {ValidationError} from "./Validator";
import {checkMaskEquals} from "../../utils/Masks";


/**
 * Not empty: string must be not empty.
 */

export class ValidationErrorEmpty extends ValidationError {}

export const ruleNotEmpty = (value: string): ValidationError[] => {
  return value === "" ? [new ValidationErrorEmpty()] : [];
}


/**
 * Not short: string must be longer than 8 symbols.
 */

export class ValidationErrorShort extends ValidationError {};

export const ruleNotShort = (value: string): ValidationError[] => {
  return value.length < 8 ? [new ValidationErrorShort()] : [];
}


/**
 * IsGUID: string must be a valid GUID.
 */

export class ValidationErrorNotGuid extends ValidationError {};

export const ruleIsGuid = (value: string): ValidationError[] => {
  const mask: string =
    "[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[8-b][0-9a-f]{3}-[0-9a-f]{12}";

  if (!checkMaskEquals(value, new RegExp(mask)))
    return [new ValidationErrorNotGuid()];

  else
    return [];
}
