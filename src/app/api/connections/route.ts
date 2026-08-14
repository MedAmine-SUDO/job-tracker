import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ConnectionUseCases } from "@/lib/core/usecases/connection-usecases";

/**
 * GET /api/connections
 * Works with ANY database adapter (Prisma, Dexie)
 * Just change DATABASE_ADAPTER in .env.local
 */
export async function GET() {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getConnectionRepository();
    const useCases = new ConnectionUseCases(repo);
    const connections = await useCases.listConnections(userId);

    return NextResponse.json(connections);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/connections error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/connections
 */
export async function POST(req: Request) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const body = await req.json();
    const repo = await container.getConnectionRepository();
    const useCases = new ConnectionUseCases(repo);

    const connection = await useCases.createConnection(userId, {
      name: body.name,
      linkedinUrl: body.linkedinUrl,
      purpose: body.purpose,
      customPurpose: body.customPurpose,
      status: body.status,
      notes: body.notes,
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/connections error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
