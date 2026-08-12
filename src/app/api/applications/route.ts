import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ApplicationUseCases } from "@/lib/core/usecases/application-usecases";

/**
 * GET /api/applications
 * Works with ANY database adapter (Prisma, Dexie, Supabase)
 * Just change DATABASE_ADAPTER in .env.local
 */
export async function GET() {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);
    const apps = await useCases.listApplications(userId);

    return NextResponse.json(apps);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/applications
 */
export async function POST(req: Request) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const body = await req.json();
    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);

    const app = await useCases.createApplication(userId, {
      companyName: body.companyName,
      positionTitle: body.positionTitle,
      status: body.status,
      applicationDate: body.applicationDate ? new Date(body.applicationDate) : undefined,
      jobPostingUrl: body.jobPostingUrl,
      jobDescriptionText: body.jobDescriptionText,
      salaryRangeMin: body.salaryRangeMin,
      salaryRangeMax: body.salaryRangeMax,
      salaryCurrency: body.salaryCurrency,
      location: body.location,
      workType: body.workType,
      source: body.source,
      tags: body.tags,
      notes: body.notes,
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}