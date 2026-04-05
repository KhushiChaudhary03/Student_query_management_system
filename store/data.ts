import { Question } from "../components/types";

export const SEED_QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "How do I solve integration by parts in calculus?",
    body: "I keep making mistakes with the LIATE rule. Can someone walk through a clear example like ∫x·eˣ dx step by step?",
    author: "Rahul Sharma", college: "Delhi University",
    subject: "Mathematics", tags: ["Calculus", "Integration"],
    votes: 14, answers: 2, createdAt: "2h ago",
    answersList: [
      { id: "a1", author: "Priya Mehta", college: "IIT Delhi", isAccepted: true, votes: 9, createdAt: "1h ago",
        body: "Use ∫u dv = uv − ∫v du. LIATE picks u in order: Logarithmic → Inverse trig → Algebraic → Trig → Exponential.\n\nFor ∫x·eˣ dx:\n  u = x  →  du = dx\n  dv = eˣdx  →  v = eˣ\n  = xeˣ − ∫eˣ dx = xeˣ − eˣ + C = eˣ(x−1) + C ✓" },
      { id: "a2", author: "Arjun Patel", college: "NSIT", isAccepted: false, votes: 4, createdAt: "30m ago",
        body: "Think of it as the reverse product rule. Good practice problems: ∫x·sin x dx and ∫ln x dx. Once those click, the pattern sticks." },
    ],
  },
  {
    id: "q2",
    title: "TCP vs UDP — when do you use each?",
    body: "My networking exam asks for practical scenarios. What real-world applications prefer UDP over TCP and why?",
    author: "Priya Mehta", college: "IIT Delhi",
    subject: "Computer Networks", tags: ["TCP", "UDP", "Networking"],
    votes: 26, answers: 1, createdAt: "4h ago",
    answersList: [
      { id: "a3", author: "Sneha Roy", college: "NIT Trichy", isAccepted: true, votes: 17, createdAt: "3h ago",
        body: "TCP: reliable, ordered, handshake — use for HTTP/S, email, file transfer, anything where data integrity matters.\n\nUDP: fast, connectionless, no retry — use for live video, gaming, VoIP, DNS. Latency > reliability there." },
    ],
  },
  {
    id: "q3",
    title: "Best roadmap for DSA preparation before placements?",
    body: "I'm in 2nd year CSE and want to start competitive programming seriously. What order should I learn topics, and which platforms?",
    author: "Arjun Patel", college: "NSIT",
    subject: "Data Structures", tags: ["DSA", "Placements", "Algorithms"],
    votes: 41, answers: 1, createdAt: "1d ago",
    answersList: [
      { id: "a4", author: "Karan Singh", college: "BITS Pilani", isAccepted: false, votes: 24, createdAt: "20h ago",
        body: "Order: Arrays → Strings → Hashing → Two Pointers → Sliding Window → Stack/Queue → Binary Search → Trees → Graphs → DP.\n\nResources: Striver's A2Z Sheet, NeetCode 150, Abdul Bari on YouTube. Start LeetCode after basics." },
    ],
  },
  {
    id: "q4",
    title: "Explain Kirchhoff's Voltage Law with a worked example",
    body: "I understand KVL in theory but keep getting wrong signs in multi-loop circuits. Can someone show a full worked example?",
    author: "Sneha Roy", college: "NIT Trichy",
    subject: "Electrical Engineering", tags: ["KVL", "Circuits"],
    votes: 8, answers: 0, createdAt: "2d ago",
    answersList: [],
  },
  {
    id: "q5",
    title: "Process vs Thread — memory sharing and when to use each?",
    body: "I get confused about when context-switching costs make threads worse than processes. Looking for a practical mental model.",
    author: "Meera Iyer", college: "IIT Bombay",
    subject: "Computer Science", tags: ["OS", "Concurrency"],
    votes: 31, answers: 1, createdAt: "3d ago",
    answersList: [
      { id: "a5", author: "Rahul Sharma", college: "Delhi University", isAccepted: true, votes: 20, createdAt: "2d ago",
        body: "Processes: separate memory, heavy context switch (~μs), good for isolation (browser tabs). Threads: shared heap, lighter switch, good for parallelism within one app (web server request handlers).\n\nRule of thumb: need isolation → process. Need shared state + speed → thread." },
    ],
  },
];
