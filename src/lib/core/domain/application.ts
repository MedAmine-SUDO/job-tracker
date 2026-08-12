export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "phone_screen"
  | "technical"
  | "onsite"
  | "offer"
  | "accepted"
  | "rejected"
  | "ghosted"
  | "withdrawn";

export type WorkType = "remote" | "hybrid" | "onsite" | "unknown";

export type InterviewFormat = "video" | "phone" | "onsite" | "take_home";

export type CommType = "email" | "call" | "message" | "note";

export type CommDirection = "sent" | "received" | "internal";

export type AttachmentCategory =
  | "resume"
  | "cover_letter"
  | "job_description"
  | "offer_letter"
  | "other";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  phone_screen: "Phone Screen",
  technical: "Technical",
  onsite: "Onsite",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  ghosted: "Ghosted",
  withdrawn: "Withdrawn",
};

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Onsite",
  unknown: "Unknown",
};

export interface Contact {
  id: string;
  applicationId: string;
  name: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  phone?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Interview {
  id: string;
  applicationId: string;
  round: string;
  scheduledDate: Date;
  format: InterviewFormat;
  locationOrLink?: string;
  durationMinutes?: number;
  questions?: string;
  notes?: string;
  rating?: number;
  completed: boolean;
  createdAt: Date;
}

export interface CommunicationLog {
  id: string;
  applicationId: string;
  contactId?: string;
  type: CommType;
  direction: CommDirection;
  content: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  applicationId?: string;
  title: string;
  dueDate: Date;
  isCompleted: boolean;
  notificationSent: boolean;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  applicationId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: AttachmentCategory;
  uploadedAt: Date;
}

export const CATEGORY_LABELS: Record<AttachmentCategory, string> = {
  resume: "Resume",
  cover_letter: "Cover Letter",
  job_description: "Job Description",
  offer_letter: "Offer Letter",
  other: "Other",
};

export interface CreateAttachmentInput {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: AttachmentCategory;
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  positionTitle: string;
  status: ApplicationStatus;
  applicationDate: Date;
  jobPostingUrl?: string;
  jobDescriptionText?: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  salaryCurrency: string;
  location?: string;
  workType: WorkType;
  source?: string;
  tags: string[];
  notes?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  contacts?: Contact[];
  interviews?: Interview[];
  communications?: CommunicationLog[];
  reminders?: Reminder[];
  attachments?: Attachment[];
}

export interface CreateApplicationInput {
  companyName: string;
  positionTitle: string;
  status?: ApplicationStatus;
  applicationDate?: Date;
  jobPostingUrl?: string;
  jobDescriptionText?: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  salaryCurrency?: string;
  location?: string;
  workType?: WorkType;
  source?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> {
  isArchived?: boolean;
}
