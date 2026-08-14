import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ConnectionUseCases } from "@/lib/core/usecases/connection-usecases";

/**
 * GET /api/connections/:id
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getConnectionRepository();
    const useCases = new ConnectionUseCases(repo);

    const connection = await useCases.getConnection(params.id, userId);
    if (!connection) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(connection);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/connections/:id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/connections/:id
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const body = await req.json();
    const repo = await container.getConnectionRepository();
    const useCases = new ConnectionUseCases(repo);

    const connection = await useCases.updateConnection(params.id, userId, body);
    return NextResponse.json(connection);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Connection not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("PATCH /api/connections/:id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/connections/:id
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getConnectionRepository();
    const useCases = new ConnectionUseCases(repo);

    await useCases.deleteConnection(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Connection not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/connections/:id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
