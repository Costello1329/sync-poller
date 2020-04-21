import {
  Validator,
  ValidationError
} from "../../../utils/validation/Validator";
import {
  ruleNotEmpty,
  ValidationErrorEmpty,
  ruleIsGuid,
  ValidationErrorNotGuid,
} from "../../../utils/validation/CommonValidators";
import {localization} from "../../../static/Localization";


/**
 * Token validator:
 */

export const tokenValidator: Validator =
new Validator(
  [ruleNotEmpty, ruleIsGuid],
  (error: ValidationError): string => {
    if (error instanceof ValidationErrorEmpty)
      return localization.emptyString();
    else if (error instanceof ValidationErrorNotGuid)
      return localization.notValidToken();
    else
      return localization.unforseenValidationError();
  }
);
