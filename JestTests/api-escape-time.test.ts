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

// 3. Require prisma + route AFTER mocks
const { prisma } = require("@/lib/prisma");
const { POST, GET } = require("@/app/api/escape-time/route");


function makeMockRequest(body: any) {
  return {
    json: async () => body,
  } as any;
}

describe("/api/escape-time POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a record and returns 201", async () => {
    const fakeRecord = {
      id: "1",
      timeSeconds: 12,
      createdAt: "2024-01-01T00:00:00.000Z",
      studentId: null,
      route: "/escape",
      studentFirstName: null,
    };

    (prisma.escapeTime.create as jest.Mock).mockResolvedValueOnce(fakeRecord);

    const req = makeMockRequest({ timeSeconds: 12 });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();


    const returnedTime =
      json?.timeSeconds ?? json?.record?.timeSeconds ?? null;
    expect(returnedTime).toBe(12);


    expect(prisma.escapeTime.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        timeSeconds: 12,
      }),
    });
  });
});

describe("/api/escape-time GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns top records ordered by timeSeconds", async () => {
    const fakeRecord = {
      id: "1",
      timeSeconds: 5,
      createdAt: "2024-01-01T00:00:00.000Z",
      studentId: null,
      route: "/escape",
      studentFirstName: "Test",
    };

    (prisma.escapeTime.findMany as jest.Mock).mockResolvedValueOnce([
      fakeRecord,
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();

    
    const records = Array.isArray(json.records) ? json.records : json;
    expect(Array.isArray(records)).toBe(true);
    expect(records).toHaveLength(1);

    expect(prisma.escapeTime.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          { timeSeconds: "asc" },
          { createdAt: "asc" },
        ],
        take: 5,
      })
    );
  });
});
