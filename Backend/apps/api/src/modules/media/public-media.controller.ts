import { Controller, Get, Param, Res } from "@nestjs/common";
import type { Response } from "express";
import { Public } from "../../common/decorators";
import { MediaService } from "./media.service";
import { streamMediaFile } from "./media-stream";

@Controller("v1/public/media")
export class PublicMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get(":siteId/:id")
  async file(
    @Param("siteId") siteId: string,
    @Param("id") id: string,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.mediaService.openReadyFile(siteId, id);
    await streamMediaFile(
      response,
      file,
      "public, max-age=86400, stale-while-revalidate=604800",
    );
  }
}
