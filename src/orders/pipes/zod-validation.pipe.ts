import {
	type ArgumentMetadata,
	BadRequestException,
	type PipeTransform,
} from "@nestjs/common";
import { ZodError, type ZodType } from "zod";

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodType) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		try {
			const parsedValue = this.schema.parse(value);
			return parsedValue;
		} catch (error) {
			if (error instanceof ZodError) {
				const violations = error.issues.map((issue) => ({
					path: issue.path.join("."),
					message: issue.message,
				}));
				throw new BadRequestException({
					message: "Validation failed",
					errors: violations,
				});
			}
			throw new BadRequestException("Validation failed");
		}
	}
}
