import { Controller } from "@nestjs/common";

import type { ReturnService } from "../services/return.service";

@Controller()
export class ReturnController {
	constructor(private readonly returnService: ReturnService) {}
}
