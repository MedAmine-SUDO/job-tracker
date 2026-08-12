import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ApplicationUseCases } from "@/lib/core/usecases/application-usecases";
import { AttachmentCategory } from "@/lib/core/domain/application";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/applications/:id/attachments
 * Uploads a resume / job description / etc. for an application.
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const formData = await req.formData();
    const file = formData.get("file");
    const category = formData.get("category");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const validCategories: AttachmentCategory[] = [
      "resume",
      "cover_letter",
      "job_description",
      "offer_letter",
      "other",
    ];
    const cat = validCategories.includes(category as AttachmentCategory)
      ? (category as AttachmentCategory)
      : "other";

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be 10MB or smaller" },
        { status: 400 }
      );
    }

    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);

    const attachment = await useCases.uploadAttachment(
      params.id,
      userId,
      file,
      cat
    );

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Application not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("POST /api/applications/:id/attachments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
