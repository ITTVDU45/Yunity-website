import { resolveAccess } from "./access-resolver";

const roles = new Map([
  [
    "role-super",
    { id: "role-super", permissions: ["*"], isGlobal: true },
  ],
  [
    "role-editor",
    {
      id: "role-editor",
      permissions: ["pages.read", "pages.update"],
      isGlobal: false,
    },
  ],
  [
    "role-reviewer",
    {
      id: "role-reviewer",
      permissions: ["pages.read", "pages.publish"],
      isGlobal: false,
    },
  ],
]);

describe("resolveAccess", () => {
  test("globale Rolle landet in globalPermissions", () => {
    const access = resolveAccess(
      [{ roleId: "role-super", siteId: null }],
      roles,
    );
    expect(access.globalPermissions).toEqual(["*"]);
    expect(access.permissionsBySite).toEqual({});
  });

  test("site-gebundene Rollen werden je Site zusammengefuehrt", () => {
    const access = resolveAccess(
      [
        { roleId: "role-editor", siteId: "site-1" },
        { roleId: "role-reviewer", siteId: "site-1" },
        { roleId: "role-editor", siteId: "site-2" },
      ],
      roles,
    );
    expect(access.permissionsBySite["site-1"].sort()).toEqual([
      "pages.publish",
      "pages.read",
      "pages.update",
    ]);
    expect(access.permissionsBySite["site-2"]).toEqual([
      "pages.read",
      "pages.update",
    ]);
  });

  test("unbekannte Rollen-Ids werden ignoriert", () => {
    const access = resolveAccess(
      [{ roleId: "missing", siteId: "site-1" }],
      roles,
    );
    expect(access.permissionsBySite).toEqual({});
    expect(access.globalPermissions).toEqual([]);
  });
});
