import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import type { AuthUser, SessionInfo } from "@yunity/contracts";
import { CurrentAuth, Public } from "../../common/decorators";
import type { AuthContext } from "../../common/request-context";
import { SitesService } from "../sites/sites.service";
import { UsersService } from "../users/users.service";
import { AuthService, type RequestMeta } from "./auth.service";
import { clearSessionCookies, setSessionCookies } from "./cookies";
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from "./dto";

function metaFrom(request: Request): RequestMeta {
  return {
    ipAddress: request.ip ?? null,
    userAgent: request.headers["user-agent"] ?? null,
  };
}

@Controller("v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly sitesService: SitesService,
  ) {}

  @Public()
  @Post("login")
  @HttpCode(200)
  // 5 Versuche pro 15 Minuten (siehe docs/architecture.md §11).
  @Throttle({ default: { limit: 5, ttl: 15 * 60 * 1000 } })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthUser> {
    const result = await this.authService.login(
      dto.email,
      dto.password,
      dto.rememberMe ?? false,
      metaFrom(request),
    );
    setSessionCookies(
      response,
      result.sessionToken,
      result.session.absoluteExpiresAt,
    );
    return this.buildAuthUser(result.user);
  }

  @Post("logout")
  @HttpCode(200)
  async logout(
    @CurrentAuth() auth: AuthContext,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ loggedOut: boolean }> {
    const sessions = await this.authService.listSessions(
      auth.user._id.toString(),
    );
    const current = sessions.find(
      (session) => session._id.toString() === auth.sessionId,
    );
    if (current) {
      await this.authService.logout(current, auth.user, metaFrom(request));
    }
    clearSessionCookies(response);
    return { loggedOut: true };
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(
    @CurrentAuth() auth: AuthContext,
  ): Promise<{ expiresAt: string }> {
    const sessions = await this.authService.listSessions(
      auth.user._id.toString(),
    );
    const current = sessions.find(
      (session) => session._id.toString() === auth.sessionId,
    );
    if (!current) {
      throw new NotFoundException("Sitzung nicht gefunden.");
    }
    const expiresAt = await this.authService.refreshSession(current);
    return { expiresAt: expiresAt.toISOString() };
  }

  @Get("me")
  async me(@CurrentAuth() auth: AuthContext): Promise<AuthUser> {
    return this.buildAuthUser(auth.user, auth);
  }

  @Get("sessions")
  async sessions(@CurrentAuth() auth: AuthContext): Promise<SessionInfo[]> {
    const sessions = await this.authService.listSessions(
      auth.user._id.toString(),
    );
    return sessions.map((session) => ({
      id: session._id.toString(),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      current: session._id.toString() === auth.sessionId,
    }));
  }

  @Delete("sessions/:id")
  async revokeSession(
    @CurrentAuth() auth: AuthContext,
    @Param("id") sessionId: string,
  ): Promise<{ revoked: boolean }> {
    const revoked = await this.authService.revokeSession(
      auth.user._id.toString(),
      sessionId,
    );
    if (!revoked) {
      throw new NotFoundException("Sitzung nicht gefunden.");
    }
    return { revoked: true };
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60 * 60 * 1000 } })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() request: Request,
  ): Promise<{ requested: boolean }> {
    await this.authService.requestPasswordReset(dto.email, metaFrom(request));
    // Immer identische Antwort — kein User-Enumeration-Leak.
    return { requested: true };
  }

  @Public()
  @Post("reset-password")
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60 * 60 * 1000 } })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: Request,
  ): Promise<{ reset: boolean }> {
    await this.authService.resetPassword(
      dto.token,
      dto.password,
      metaFrom(request),
    );
    return { reset: true };
  }

  private async buildAuthUser(
    user: AuthContext["user"],
    existingAccess?: AuthContext,
  ): Promise<AuthUser> {
    const access =
      existingAccess ?? (await this.usersService.resolveAccessFor(user));
    const isSuperAdmin = access.globalPermissions.includes("*");
    const sites = isSuperAdmin
      ? await this.sitesService.findActive()
      : await this.sitesService.findByIds(
          Object.keys(access.permissionsBySite),
        );

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      globalPermissions: access.globalPermissions,
      permissionsBySite: access.permissionsBySite,
      sites: sites.map((site) => this.sitesService.toSummary(site)),
    };
  }
}
