export const eventsData = {
  thisWeek: [
    {
      id: 1,
      day: "14", month: "Mar", time: "6:00 PM",
      dateBg: "#D1FAE5", dateColor: "#065F46",
      title: "TED Talk: The Future of Artificial Intelligence",
      badge: "🎤 Seminar", badgeStyle: { background: "#DBEAFE", color: "#1E40AF" },
      meta: ["📍 Auditorium, Main Building", "⏱️ 2 hours", "👥 AI Society"],
      desc: "Featuring Dr. Anil Kumar (ex-Google DeepMind). Open to all students — no registration required.",
      rsvpLabel: "RSVP Free", going: "86 going", initialGoing: false,
    },
    {
      id: 2,
      day: "12", month: "Mar", time: "4:00 PM",
      dateBg: "#EDE9FE", dateColor: "#5B21B6",
      title: "OS Exam Prep Study Session",
      badge: "🛠️ Workshop", badgeStyle: { background: "#CCFBF1", color: "#0F766E" },
      meta: ["📍 Library, Room 204", "⏱️ 3 hours", "👥 OS Exam Prep Group"],
      desc: "Collaborative revision covering Process Scheduling, Deadlocks, and Memory Management before exams.",
      rsvpLabel: "✓ Going", going: "12 going", initialGoing: true,
    },
  ],
  comingUp: [
    {
      id: 3,
      day: "22", month: "Mar", time: "5:00 PM",
      dateBg: "#FCE7F3", dateColor: "#9D174D",
      title: "Annual Cultural Fest — Tarang 2025",
      badge: "🎭 Cultural", badgeStyle: { background: "#FCE7F3", color: "#9D174D" },
      meta: ["📍 Open Air Theatre", "⏱️ 3 days", "👥 Cultural Committee"],
      desc: "The biggest cultural event of the year — music, dance, drama, and much more. Register for individual or group events by March 18.",
      rsvpLabel: "RSVP", going: "320 going", initialGoing: false,
    },
    {
      id: 4,
      day: "28", month: "Mar", time: "10:00 AM",
      dateBg: "#D1FAE5", dateColor: "#065F46",
      title: "Annual Photography Exhibition 2025",
      badge: "📷 Club Event", badgeStyle: { background: "#EEF1FE", color: "#4F6EF7" },
      meta: ["📍 Gallery Hall, Block C", "⏱️ Full Day", "👥 Photography Club"],
      desc: "Showcasing the best campus photography from the year — portraits, architecture, nature and street photography by students.",
      rsvpLabel: "RSVP Free", going: "67 going", initialGoing: false,
    },
    {
      id: 5,
      day: "5", month: "Apr", time: "8:00 AM",
      dateBg: "#EEF1FE", dateColor: "#4F6EF7",
      title: "Annual Sports Day 2025 🏆",
      badge: "⚽ Sports", badgeStyle: { background: "#D1FAE5", color: "#065F46" },
      meta: ["📍 College Ground", "⏱️ Full Day", "👥 Sports Department"],
      desc: "Athletics, cricket, football, basketball, badminton and more. Registration closes March 20. Every student can participate in up to 2 events.",
      rsvpLabel: "Register", going: "214 going", initialGoing: false,
    },
  ],
  past: [
    {
      id: 6,
      day: "28", month: "Feb", time: "",
      dateBg: "#f1f5f9", dateColor: "#94a3b8",
      title: "Tech Talk: Web3 & Blockchain Basics",
      badge: "🎤 Seminar", badgeStyle: { background: "#f1f5f9", color: "#94a3b8" },
      meta: ["📍 Seminar Hall B", "👥 64 attended"],
      desc: "", rsvpLabel: "Ended", going: "📷 View Gallery", isPast: true,
    },
  ],
};

export const calendarEvents = {
  5:  [{ label: "Fee Deadline", pill: "teal" }],
  12: [{ label: "OS Study Session", pill: "blue" }],
  14: [{ label: "TED Talk: AI", pill: "green" }],
  15: [{ label: "CampusHack 🚀", pill: "purple" }],
  16: [{ label: "CampusHack Day 2", pill: "purple" }],
  18: [{ label: "Exams Begin ✏️", pill: "orange" }],
  19: [{ label: "DBMS Exam", pill: "orange" }],
  21: [{ label: "OS Exam", pill: "red" }],
  22: [{ label: "Tarang Fest", pill: "green" }],
  25: [{ label: "Project Submit", pill: "teal" }],
  28: [{ label: "Sports Day Reg.", pill: "blue" }],
  29: [{ label: "Photo Exhibition", pill: "orange" }],
};

export const myEvents = [
  { day: "15", month: "Mar", title: "CampusHack 2025", sub: "Main Hall · 10:00 AM", status: "going" },
  { day: "12", month: "Mar", title: "OS Study Session", sub: "Library 204 · 4:00 PM", status: "going" },
  { day: "22", month: "Mar", title: "Tarang Cultural Fest", sub: "Open Air Theatre", status: "interested" },
];

export const activeClubs = [
  { icon: "💻", iconBg: "#DBEAFE", name: "Coding Club", events: "2 events this month", following: true },
  { icon: "🎭", iconBg: "#FCE7F3", name: "Drama Society", events: "1 event this month", following: false },
  { icon: "🤖", iconBg: "#EDE9FE", name: "AI Society", events: "1 event this month", following: false },
  { icon: "⚽", iconBg: "#D1FAE5", name: "Sports Committee", events: "Sports Day coming up", following: false },
];

export const filters = ["🗂️ All", "💻 Hackathon", "🎉 Fest", "🎤 Seminar", "⚽ Sports", "🎭 Cultural", "🛠️ Workshop"];
