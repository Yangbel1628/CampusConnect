import { colors } from "../styles/theme";

export const stories = [
  { emoji: "➕", label: "Add Story", isAdd: true },
  { emoji: "👩", label: "Priya" },
  { emoji: "👨", label: "Arjun" },
  { emoji: "💻", label: "Coding Club", grad: "linear-gradient(135deg,#FFD93D,#FF6B6B)" },
  { emoji: "🎉", label: "TechFest", grad: "linear-gradient(135deg,#6BCB77,#4F6EF7)" },
  { emoji: "📷", label: "Photo Club", grad: "linear-gradient(135deg,#a855f7,#ec4899)" },
  { emoji: "🧑", label: "Sneha" },
];

export const posts = [
  {
    id: 1,
    isNotice: true,
    avatarGrad: "linear-gradient(135deg,#FF9F43,#FFD93D)",
    avatarEmoji: "🏛️",
    author: "College Administration",
    tagType: "notice",
    tag: "📌 NOTICE",
    sub: "Official Account",
    time: "2 hours ago",
    audience: "🌐 Everyone",
    text: `📋 <strong>Semester 6 Examination Schedule — 2025</strong><br/><br/>
The timetable for the upcoming Semester 6 examinations has been officially published. Exams begin from <strong>March 18, 2025</strong>. Students are advised to check the detailed schedule and report any clashes to their respective department offices before <strong>March 5</strong>.<br/><br/>
<span style="color:#4F6EF7;font-weight:700;">#ExamSchedule</span> <span style="color:#4F6EF7;font-weight:700;">#Semester6</span> <span style="color:#4F6EF7;font-weight:700;">#Important</span>`,
    attachment: { name: "Exam_Schedule_Sem6.pdf", size: "340 KB" },
    reactionEmojis: "👁️",
    reactions: "1,240 views",
    statsRight: "84 comments",
    comments: [
      { avatar: "👩", avatarBg: "#DBEAFE", author: "Priya Mehra", text: "Is the clash form available online too?", likes: "Like" },
    ],
  },
  {
    id: 2,
    avatarGrad: "linear-gradient(135deg,#4F6EF7,#7B61FF)",
    avatarEmoji: "💻",
    author: "Coding Club",
    tagType: "event",
    tag: "🎉 EVENT",
    sub: "Club Page",
    time: "4 hours ago",
    audience: "🌐 Everyone",
    text: `🚀 Excited to announce <strong>CampusHack 2025</strong> — our 24-hour hackathon is back and bigger than ever! Form teams of 2–4, pick a problem statement, and build something amazing.<br/><br/><span style="color:#4F6EF7;font-weight:700;">#CampusHack2025</span> <span style="color:#4F6EF7;font-weight:700;">#Hackathon</span> <span style="color:#FF6B6B;font-weight:700;">@CSEDepartment</span>`,
    event: {
      day: "15",
      month: "Mar",
      title: "CampusHack 2025 — 24hr Hackathon",
      sub: "📍 Main Seminar Hall, Block A · ⏰ 10:00 AM onwards",
      going: 142,
      interested: 38,
    },
    reactionEmojis: "🎉❤️👍",
    reactions: "248 reactions",
    statsRight: "36 comments · 52 shares",
    comments: [
      { avatar: "👨", avatarBg: "#D1FAE5", author: "Arjun Nair", text: "This is going to be lit 🔥 already formed a team!", likes: "12" },
    ],
  },
  {
    id: 3,
    avatarGrad: "linear-gradient(135deg,#FF6B6B,#FFD93D)",
    avatarEmoji: "👩",
    author: "Priya Mehra",
    tagType: "academic",
    tag: "📚 ACADEMIC",
    sub: "CSE • 3rd Year",
    time: "5 hours ago",
    audience: "🏫 CSE Dept",
    text: "Quick check before the exam — which topic are you most nervous about? Let's form study groups based on results! 📊",
    poll: {
      question: "Which OS topic needs the most revision?",
      options: [
        { label: "⚙️ Process Scheduling", pct: 62, winner: true },
        { label: "🧠 Memory Management", pct: 22 },
        { label: "🔒 Deadlocks", pct: 10 },
        { label: "💾 File Systems", pct: 6 },
      ],
      meta: "💬 164 votes · Ends in 2 days",
    },
    reactionEmojis: "👍😮",
    reactions: "47 reactions",
    statsRight: "18 comments",
  },
  {
    id: 4,
    avatarGrad: "linear-gradient(135deg,#6BCB77,#4F6EF7)",
    avatarEmoji: "🧑",
    author: "Sneha Kulkarni",
    tagType: "social",
    tag: "✨ SOCIAL",
    sub: "CSE • 3rd Year",
    time: "Yesterday",
    audience: "🌐 Everyone",
    text: `Best evening at the Annual Photography Exhibition 📸 Our club worked so hard on this and seeing it all come together was magical! <span style="color:#4F6EF7;font-weight:700;">#CampusLife</span> <span style="color:#4F6EF7;font-weight:700;">#PhotoExhibition</span>`,
    images: [
      { bg: "linear-gradient(135deg,#667eea,#f093fb)", emoji: "📸" },
      { bg: "linear-gradient(135deg,#667eea,#764ba2)", emoji: "🌅" },
      { bg: "linear-gradient(135deg,#f093fb,#f5576c)", emoji: "🎨" },
    ],
    initialLiked: true,
    reactionEmojis: "❤️👍🎉",
    reactions: "312 reactions",
    statsRight: "45 comments · 28 shares",
  },
  {
    id: 5,
    avatarGrad: "linear-gradient(135deg,#a855f7,#ec4899)",
    avatarEmoji: "🏢",
    author: "Placement Cell",
    tagType: "job",
    tag: "💼 OPPORTUNITY",
    sub: "Official",
    time: "6 hours ago",
    audience: "🌐 Everyone",
    text: `🔥 <strong>Google Summer Internship 2025</strong> is now open for applications! This is a paid 12-week internship at Google's Bangalore office, open to 3rd and final year students. Deadline is <strong>March 1</strong> — don't miss it!`,
    jobCard: {
      title: "Google Summer Internship 2025",
      sub: "Software Engineering Intern · Bangalore · ₹80,000/month",
      tags: [
        { label: "3rd Year+", bg: colors.primaryLight, color: colors.primary },
        { label: "CSE / ECE", bg: "#D1FAE5", color: "#065F46" },
        { label: "Deadline: Mar 1", bg: "#FFF3CD", color: "#856404" },
      ],
    },
    reactionEmojis: "🔥👍",
    reactions: "189 reactions",
    statsRight: "22 comments",
  },
];

export const notices = [
  { dot: "#FF6B6B", title: "Semester 6 Exam Schedule Published", time: "2 hours ago · Admin" },
  { dot: "#4F6EF7", title: "Library Timings Extended During Exams", time: "Yesterday · Library" },
  { dot: "#6BCB77", title: "Sports Day Registration Now Open", time: "2 days ago · Sports Dept" },
];

export const upcomingEvents = [
  { day: "15", month: "Mar", title: "CampusHack 2025 🚀", sub: "Coding Club · Main Hall" },
  { day: "18", month: "Mar", title: "Semester 6 Exams Begin 📝", sub: "All Depts · Exam Block" },
  { day: "22", month: "Mar", title: "TED Talk: Future of AI 🎤", sub: "AI Society · Auditorium" },
  { day: "28", month: "Mar", title: "Annual Photography Exhibition 📸", sub: "Photo Club · Gallery" },
];

export const trending = [
  { tag: "#CampusHack2025", count: "420 posts", hot: true },
  { tag: "#Sem6Exams", count: "316 posts" },
  { tag: "#GoogleInternship", count: "204 posts" },
  { tag: "#PhotoExhibition", count: "118 posts" },
  { tag: "#OSExamPrep", count: "96 posts" },
];

export const suggestedFriends = [
  { emoji: "👨", grad: "linear-gradient(135deg,#4F6EF7,#7B61FF)", name: "Vikram Singh", mutual: "CSE · 14 mutual" },
  { emoji: "👩", grad: "linear-gradient(135deg,#FF6B6B,#FFD93D)", name: "Ananya Reddy", mutual: "ECE · 9 mutual" },
  { emoji: "🧑", grad: "linear-gradient(135deg,#6BCB77,#4F6EF7)", name: "Karan Mehta", mutual: "CSE · 7 mutual" },
];

export const notifications = [
  { unread: true, icon: "📢", iconBg: "#FFF3CD", msg: "<strong>Admin Notice:</strong> Semester 6 exam schedule has been published", time: "5 min ago" },
  { unread: true, icon: "🎉", iconBg: "#D1FAE5", msg: "<strong>TechFest Club</strong> posted a new event you might like", time: "22 min ago" },
  { unread: true, icon: "❤️", iconBg: "#FCE7F3", msg: "<strong>Priya Mehra</strong> and 12 others liked your post", time: "1 hr ago" },
  { unread: false, icon: "💼", iconBg: "#DBEAFE", msg: "New internship matching your profile: <strong>Google SWE Intern</strong>", time: "3 hrs ago" },
  { unread: false, icon: "📚", iconBg: "#EDE9FE", msg: "<strong>Arjun Nair</strong> answered your doubt in OS study group", time: "Yesterday" },
];
