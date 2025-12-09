// @ts-nocheck

// 1. Mock next/server BEFORE importing the route
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body, init) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

// 2. Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    escapeTime: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// 3. require prisma + route 
const { prisma } = require("@/lib/prisma");
const { POST, GET } = require("@/app/api/escape-time/route");

// Helper: minimal "Request" object
function makeMockRequest(body: any) {
  return {
    json: async () => body,
  } as any;
}

describe("/api/escape-time POST", () => {
  it("returns 400 for invalid timeSeconds", async () => {
    const req = makeMockRequest({ timeSeconds: -5 });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates a record and returns 201", async () => {
    (prisma.escapeTime.create as jest.Mock).mockResolvedValueOnce({
      id: "1",
      timeSeconds: 12,
      createdAt: new Date().toISOString(),
      studentId: null,
      route: "/escape",
    });

    const req = makeMockRequest({ timeSeconds: 12 });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(prisma.escapeTime.create).toHaveBeenCalledWith({
      data: {
        timeSeconds: 12,
        studentId: null,
        route: "/escape",
      },
    });
  });
});

describe("/api/escape-time GET", () => {
  it("returns top records ordered by timeSeconds", async () => {
    (prisma.escapeTime.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: "1",
        timeSeconds: 5,
        createdAt: new Date().toISOString(),
        studentId: null,
        route: "/escape",
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.records).toHaveLength(1);
    expect(prisma.escapeTime.findMany).toHaveBeenCalledWith({
      where: { route: "/escape" },
      orderBy: [
        { timeSeconds: "asc" },
        { createdAt: "asc" },
      ],
      take: 10,
    });
  });
});
