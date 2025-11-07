import { BadRequestException, type PipeTransform } from "@nestjs/common";
import vine from "@vinejs/vine";

export class VineValidationPipe implements PipeTransform {
  constructor(private schema: ReturnType<typeof vine.compile>) {}

  async transform(value: unknown) {
    const { value: output, error } = await this.schema.validate(value);

    if (error) {
      const violations = error.messages;
      throw new BadRequestException({
        message: "Validation failed",
        errors: violations,
      });
    }

    return output;
  }
}
