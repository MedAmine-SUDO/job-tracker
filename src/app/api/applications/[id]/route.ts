import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ApplicationUseCases } from "@/lib/core/usecases/application-usecases";

/**
 * GET /api/applications/:id
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);

    const app = await useCases.getApplication(params.id, userId);
    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/applications/:id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/applications/:id
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const body = await req.json();
    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);

    const app = await useCases.updateApplication(params.id, userId, body);
    return NextResponse.json(app);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Application not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("PATCH /api/applications/:id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/applications/:id
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);

    await useCases.deleteApplication(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/applications/:id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}