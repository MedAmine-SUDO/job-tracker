import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ApplicationUseCases } from "@/lib/core/usecases/application-usecases";

/**
 * DELETE /api/applications/:id/attachments/:attachmentId
 */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string; attachmentId: string } }
) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const repo = await container.getRepository();
    const storage = await container.getStorage();
    const useCases = new ApplicationUseCases(repo, storage);

    await useCases.deleteAttachment(params.id, userId, params.attachmentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (
      error instanceof Error &&
      (error.message === "Application not found" ||
        error.message === "Attachment not found")
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error(
      "DELETE /api/applications/:id/attachments error:",
      error
    );
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
