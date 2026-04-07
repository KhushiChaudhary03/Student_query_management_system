export type Answer = {
  id: string;
  body: string;
  author?: string;
  authorId: string;
  authorName: string;
  college: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  subject: string;
  tags: string[];
  author?: string;
  authorId: string;
  authorName: string;
  college: string;
  votes: number;
  answers: number;
  answersList: Answer[];
  createdAt: string;
  updatedAt?: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  college: string;
  department: string;
  questions: number;
  answers: number;
  votes: number;
  createdAt?: string;
};

export type Notification = {
  id: string;
  toUserId: string;
  type: "answer" | "vote" | "accepted";
  message: string;
  questionId: string;
  questionTitle: string;
  fromUserName: string;
  read: boolean;
  createdAt: string;
};
