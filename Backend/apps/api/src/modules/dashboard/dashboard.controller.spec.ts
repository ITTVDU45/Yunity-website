jest.mock("../collections/collections.service", () => ({
  CollectionsService: class CollectionsService {},
}));
jest.mock("../forms/forms.service", () => ({
  FormsService: class FormsService {},
}));
jest.mock("../forms/submissions.service", () => ({
  SubmissionsService: class SubmissionsService {},
}));
jest.mock("../pages/pages.service", () => ({
  PagesService: class PagesService {},
}));

import { DashboardController } from "./dashboard.controller";
import type { CollectionsService } from "../collections/collections.service";
import type { FormsService } from "../forms/forms.service";
import type { SubmissionsService } from "../forms/submissions.service";
import type { PagesService } from "../pages/pages.service";

describe("DashboardController", () => {
  it("liefert sitebezogene Inhaltszahlen und sortierte Aenderungen", async () => {
    const pages = {
      countByStatus: jest.fn().mockResolvedValue({ PUBLISHED: 11, DRAFT: 1 }),
      findRecent: jest.fn().mockResolvedValue([
        {
          _id: { toString: () => "page-1" },
          internalName: "Kontakt",
          translations: { de: { title: "Kontakt" } },
          status: "PUBLISHED",
          updatedAt: new Date("2026-07-15T20:00:00.000Z"),
        },
      ]),
    };
    const collections = {
      countByStatus: jest
        .fn()
        .mockResolvedValueOnce({ PUBLISHED: 8 })
        .mockResolvedValueOnce({ PUBLISHED: 9 })
        .mockResolvedValueOnce({ PUBLISHED: 3 })
        .mockResolvedValueOnce({ PUBLISHED: 5, DRAFT: 1 }),
      findRecent: jest.fn().mockResolvedValue([
        {
          _id: { toString: () => "service-1" },
          kind: "service",
          translations: { en: { title: "Event staff" } },
          status: "IN_REVIEW",
          updatedAt: new Date("2026-07-15T21:00:00.000Z"),
        },
        // Altbestand mit einer Art, die es im Modell nicht mehr gibt:
        // darf uebersprungen werden, nicht die Uebersicht sprengen.
        {
          _id: { toString: () => "legacy-1" },
          kind: "practice-area",
          translations: { en: { title: "Altbestand" } },
          status: "PUBLISHED",
          updatedAt: new Date("2026-07-15T22:00:00.000Z"),
        },
      ]),
    };
    const forms = {
      countByStatus: jest.fn().mockResolvedValue({ ACTIVE: 1, DISABLED: 1 }),
    };
    const submissions = {
      countNew: jest.fn().mockResolvedValue(4),
    };
    const controller = new DashboardController(
      pages as unknown as PagesService,
      collections as unknown as CollectionsService,
      forms as unknown as FormsService,
      submissions as unknown as SubmissionsService,
    );

    const result = await controller.overview("site-1", "en");

    expect(pages.countByStatus).toHaveBeenCalledWith("site-1");
    expect(collections.countByStatus).toHaveBeenNthCalledWith(
      1,
      "site-1",
      "service",
    );
    expect(result.stats).toEqual({
      pages: { total: 12, published: 11, pending: 1 },
      services: { total: 8, published: 8, pending: 0 },
      industries: { total: 9, published: 9, pending: 0 },
      testimonials: { total: 3, published: 3, pending: 0 },
      blogArticles: { total: 6, published: 5, pending: 1 },
      forms: { total: 2, active: 1 },
      newSubmissions: 4,
    });
    expect(result.recentContent).toEqual([
      expect.objectContaining({
        kind: "SERVICE",
        title: "Event staff",
        href: "/collections/service/service-1",
      }),
      expect.objectContaining({
        kind: "PAGE",
        title: "Kontakt",
        href: "/pages/page-1",
      }),
    ]);
  });
});
