import { colors } from "../styles/theme";

export const jobsData = [
  {
    id: 1, featured: true, ribbon: "⭐ Featured", ribbonBg: colors.primary,
    logo: "🌐", title: "Software Engineering Intern — Summer 2025",
    company: "Google India", verified: true, location: "Bangalore, India",
    tags: [
      { label: "🎓 Internship", style: { background: colors.primaryLight, color: colors.primary } },
      { label: "💻 Software Dev", style: { background: "#EDE9FE", color: "#5B21B6" } },
      { label: "💰 ₹80,000/month", style: { background: "#DBEAFE", color: "#1E40AF" } },
      { label: "3rd Year+", style: { background: "#FEF3C7", color: "#92400E" } },
      { label: "📍 Bangalore", style: { background: "#D1FAE5", color: "#065F46" } },
      { label: "⏰ 3 days left", style: { background: "#FEE2E2", color: "#9B1C1C" } },
    ],
    desc: "Work on large-scale distributed systems and collaborate with world-class engineers. The role involves building, testing and launching software products that impact billions of users.",
    match: 92,
    deadline: { label: "⏰ Closes March 1 — 3 days left", type: "urgent" },
    applicants: "👥 234 applied · 28 from your college",
  },
  {
    id: 2, ribbon: "🔥 Hot", ribbonBg: "#FF6B6B",
    logo: "🪟", title: "Full Stack Developer Intern",
    company: "Microsoft India", verified: true, location: "Hyderabad (Remote-friendly)",
    tags: [
      { label: "🎓 Internship", style: { background: colors.primaryLight, color: colors.primary } },
      { label: "💻 Software Dev", style: { background: "#EDE9FE", color: "#5B21B6" } },
      { label: "💰 ₹70,000/month", style: { background: "#DBEAFE", color: "#1E40AF" } },
      { label: "3rd Year+", style: { background: "#FEF3C7", color: "#92400E" } },
      { label: "🌐 Hybrid", style: { background: "#CCFBF1", color: "#0F766E" } },
    ],
    desc: "Build and ship features for Microsoft Azure's developer tooling suite. You'll work in a fast-paced Agile environment contributing to both frontend (React) and backend (.NET / Node.js) systems.",
    match: 85,
    deadline: { label: "⏰ Closes March 15 — 15 days left", type: "warning" },
    applicants: "👥 189 applied · 14 from your college",
    initialSaved: true,
  },
  {
    id: 3, ribbon: "✨ New", ribbonBg: "#6BCB77",
    logo: "🛵", title: "Data Science Intern — Recommendations Team",
    company: "Swiggy", location: "Bangalore, India",
    tags: [
      { label: "🎓 Internship", style: { background: colors.primaryLight, color: colors.primary } },
      { label: "🤖 Data Science / ML", style: { background: "#EDE9FE", color: "#5B21B6" } },
      { label: "💰 ₹50,000/month", style: { background: "#DBEAFE", color: "#1E40AF" } },
      { label: "3rd Year+", style: { background: "#FEF3C7", color: "#92400E" } },
      { label: "📍 Bangalore", style: { background: "#D1FAE5", color: "#065F46" } },
    ],
    desc: "Help improve Swiggy's recommendation engine and personalisation models using ML. You'll work on real-world datasets with millions of data points, using Python, pandas, scikit-learn and TensorFlow.",
    match: 78,
    deadline: { label: "✅ Closes March 28 — 28 days left", type: "safe" },
    applicants: "👥 67 applied",
  },
  {
    id: 4,
    logo: "⚡", title: "Frontend Engineer — React (Full-time)",
    company: "Zepto", location: "Mumbai, India",
    tags: [
      { label: "💼 Full-time", style: { background: colors.primaryLight, color: colors.primary } },
      { label: "💻 Frontend", style: { background: "#EDE9FE", color: "#5B21B6" } },
      { label: "💰 ₹12–18 LPA", style: { background: "#DBEAFE", color: "#1E40AF" } },
      { label: "Final Year / Freshers", style: { background: "#FEF3C7", color: "#92400E" } },
      { label: "📍 Mumbai", style: { background: "#D1FAE5", color: "#065F46" } },
    ],
    desc: "Looking for passionate React developers to join Zepto's growing tech team and help scale India's fastest grocery delivery app. Strong JavaScript fundamentals required.",
    deadline: { label: "✅ Closes April 10", type: "safe" },
    applicants: "👥 142 applied · 22 from your college",
  },
  {
    id: 5,
    logo: "🎨", title: "UI/UX Design Intern — Remote",
    company: "DesignCo Studio", location: "Remote (India)",
    tags: [
      { label: "🎓 Internship", style: { background: colors.primaryLight, color: colors.primary } },
      { label: "🎨 Design", style: { background: "#EDE9FE", color: "#5B21B6" } },
      { label: "💰 ₹20,000/month", style: { background: "#DBEAFE", color: "#1E40AF" } },
      { label: "Any Year", style: { background: "#FEF3C7", color: "#92400E" } },
      { label: "🌐 Remote", style: { background: "#CCFBF1", color: "#0F766E" } },
    ],
    desc: "Design beautiful, user-centric interfaces for SaaS products. Must have a portfolio showcasing past design work. Figma proficiency required. Flexible hours, fully remote.",
    deadline: { label: "✅ Rolling applications", type: "safe" },
    applicants: "👥 38 applied",
  },
];

export const applicationsData = [
  {
    id: 1, logo: "🌐",
    title: "Software Engineering Intern",
    company: "Google India · Bangalore · ₹80,000/mo",
    status: "shortlisted", statusLabel: "✅ Shortlisted",
    statusStyle: { background: "#D1FAE5", color: "#065F46" },
    steps: [
      { state: "done", label: "Applied" },
      { state: "done", label: "Screening" },
      { state: "active", label: "Interview" },
      { state: "pending", label: "HR Round" },
      { state: "pending", label: "Offer" },
    ],
    meta: ["📅 Applied Feb 18", "🗓️ Interview: March 14 at 11:00 AM", "📧 Confirmation email received"],
  },
  {
    id: 2, logo: "🪟",
    title: "Full Stack Developer Intern",
    company: "Microsoft India · Hyderabad · ₹70,000/mo",
    status: "review", statusLabel: "⏳ Under Review",
    statusStyle: { background: "#FEF3C7", color: "#92400E" },
    steps: [
      { state: "done", label: "Applied" },
      { state: "active", label: "Screening" },
      { state: "pending", label: "Interview" },
      { state: "pending", label: "HR Round" },
      { state: "pending", label: "Offer" },
    ],
    meta: ["📅 Applied Feb 20", "⏳ Awaiting response"],
  },
  {
    id: 3, logo: "🛵", opacity: 0.75,
    title: "Backend Engineer Intern",
    company: "Swiggy · Bangalore",
    status: "rejected", statusLabel: "❌ Not Selected",
    statusStyle: { background: "#FEE2E2", color: "#9B1C1C" },
    steps: [
      { state: "done", label: "Applied" },
      { state: "rejected", label: "Screening" },
      { state: "pending", label: "Interview" },
      { state: "pending", label: "HR Round" },
      { state: "pending", label: "Offer" },
    ],
    meta: ["📅 Applied Feb 10", "📧 Rejection email received Feb 22"],
  },
];

export const alumniData = [
  {
    id: 1, emoji: "👩", grad: "linear-gradient(135deg,#4F6EF7,#7B61FF)",
    name: "Nisha Kapoor", role: "💼 Software Engineer II", company: "Google",
    batch: "🎓 CSE · Batch of 2023 · 2 yrs experience",
    tags: ["React", "Backend", "System Design"],
  },
  {
    id: 2, emoji: "👨", grad: "linear-gradient(135deg,#FF6B6B,#FFD93D)",
    name: "Rohan Desai", role: "💼 ML Engineer", company: "Amazon",
    batch: "🎓 CSE · Batch of 2022 · 3 yrs experience",
    tags: ["Python", "Machine Learning", "AWS"],
  },
  {
    id: 3, emoji: "🧑", grad: "linear-gradient(135deg,#6BCB77,#14B8A6)",
    name: "Aisha Menon", role: "💼 Product Manager", company: "Flipkart",
    batch: "🎓 CSE · Batch of 2021 · 4 yrs experience",
    tags: ["Product", "Strategy", "SQL"],
  },
  {
    id: 4, emoji: "👩", grad: "linear-gradient(135deg,#a855f7,#ec4899)",
    name: "Deepika Sharma", role: "💼 Frontend Engineer", company: "Microsoft",
    batch: "🎓 CSE · Batch of 2023 · 1.5 yrs experience",
    tags: ["React", "TypeScript", "Azure"],
  },
];

export const deadlines = [
  { day: "1", month: "Mar", company: "Google SWE Intern", role: "Bangalore · ₹80K/mo", urgency: "3 days", urgent: true },
  { day: "15", month: "Mar", company: "Microsoft Full Stack", role: "Hyderabad · ₹70K/mo", urgency: "15 days", urgent: false },
  { day: "28", month: "Mar", company: "Swiggy Data Science", role: "Bangalore · ₹50K/mo", urgency: "28 days", urgent: false },
];

export const jobAlerts = [
  { label: "React / Frontend roles", active: true },
  { label: "ML / Data Science", active: true },
  { label: "Remote Internships", active: false },
];

export const placementStats = [
  { label: "CSE Placement Rate", value: "94%", width: 94, color: "#6BCB77", grad: "linear-gradient(90deg,#6BCB77,#3da74a)" },
  { label: "Avg. CTC (2024 Batch)", value: "₹9.4 LPA", width: 70, color: "#4F6EF7", grad: "linear-gradient(90deg,#4F6EF7,#7B61FF)" },
  { label: "Highest CTC (2024)", value: "₹42 LPA", width: 85, color: "#8B5CF6", grad: "linear-gradient(90deg,#8B5CF6,#a855f7)" },
];
