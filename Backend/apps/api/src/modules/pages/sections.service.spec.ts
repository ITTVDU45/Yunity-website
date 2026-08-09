import { NotFoundException } from "@nestjs/common";

jest.mock("./sanitize", () => ({
  sanitizeBlockData: (value: unknown) => value,
}));

import { SectionsService } from "./sections.service";

describe("SectionsService owner scoping", () => {
  test("bindet Aenderungen an Site, Owner-Typ und Owner-ID", async () => {
    const exec = jest.fn().mockResolvedValue(null);
    const findOne = jest.fn().mockReturnValue({ exec });
    const service = new SectionsService({ findOne } as never);

    await expect(
      service.update(
        "507f1f77bcf86cd799439011",
        "PAGE",
        "507f191e810c19729de860ea",
        "507f191e810c19729de860eb",
        {},
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(findOne).toHaveBeenCalledWith({
      _id: "507f191e810c19729de860eb",
      siteId: "507f1f77bcf86cd799439011",
      ownerType: "PAGE",
      ownerId: "507f191e810c19729de860ea",
      deletedAt: null,
    });
  });
});
