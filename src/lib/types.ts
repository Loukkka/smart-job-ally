export type ApplicationStatus = "Envoyé" | "Vu" | "Entretien" | "Refus" | "Offre";

export interface User {
  email: string;
  name: string;
}

export interface Resume {
  id: string;
  title: string;
  role: string;
  summary: string;
  skills: string[];
  atsScore: number;
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  company: string;
  role: string;
  tone: "Formel" | "Créatif" | "Technique";
  content: string;
  createdAt: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  tags: string[];
  description: string;
}

export interface Application {
  id: string;
  offerId: string;
  role: string;
  company: string;
  status: ApplicationStatus;
  match: number;
  date: string;
}

export interface InterviewMessage {
  role: "ai" | "user";
  content: string;
}

export interface PlanState {
  plan: "Free" | "Pro" | "Annuel";
}

export interface AppData {
  user: User | null;
  plan: PlanState["plan"];
  resumes: Resume[];
  letters: CoverLetter[];
  applications: Application[];
}
