export type Answer = {
  id: string;
  author: string;
  college: string;
  body: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  author: string;
  college: string;
  subject: string;
  tags: string[];
  votes: number;
  answers: number;
  answersList: Answer[];
  createdAt: string;
};

export type User = {
  name: string;
  email: string;
  college: string;
  department: string;
  password: string;
};
