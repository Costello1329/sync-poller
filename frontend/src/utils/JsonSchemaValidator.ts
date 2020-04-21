import Ajv, {ValidateFunction} from "ajv";



export class JsonSchemaValidator<T> {
  declare private readonly validator: ValidateFunction;

  constructor (schema: object | undefined = undefined) {
    if (schema !== undefined) {
      const ajv = new Ajv();
      this.validator = ajv.compile(schema);
    }

    else
      this.validator = (_: any): boolean => true;
  }

  validate (candidate: any): candidate is T {
    return this.validator(candidate) === true;
  }
}
