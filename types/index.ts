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

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  positionTitle: string;
  status: ApplicationStatus;
  applicationDate: string;
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
  createdAt: string;
  updatedAt: string;
  contacts?: Contact[];
  interviews?: Interview[];
  reminders?: Reminder[];
  attachments?: Attachment[];
}

export interface Contact {
  id: string;
  applicationId: string;
  name: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  phone?: string;
  notes?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  round: string;
  scheduledDate: string;
  format: InterviewFormat;
  locationOrLink?: string;
  durationMinutes?: number;
  questions?: string;
  notes?: string;
  rating?: number;
  completed: boolean;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  applicationId?: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  notificationSent: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  applicationId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: "resume" | "cover_letter" | "job_description" | "offer_letter" | "other";
  uploadedAt: string;
}

export interface ResumeVersion {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

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

export const STATUS_ORDER: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "phone_screen",
  "technical",
  "onsite",
  "offer",
  "accepted",
  "rejected",
  "ghosted",
  "withdrawn",
];
