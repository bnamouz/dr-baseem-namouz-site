// Public configuration only. Never place passwords, OAuth tokens or API secrets here.
window.MAGIC_SITE = {
  hubPublic: false,
  hubOrigin: 'https://magic-kids-hub.baseem-n.chatgpt.site',
  email: 'magickids@magickidsinstitute.com',
  // Timed pop-up shown once per visit when the website / installed app opens. Set enabled:false to stop it.
  announcement: {
    id: 'flu-2026',
    enabled: true,
    from: '2026-10-24',
    until: '2027-02-28',
    seconds: 5,
    href: 'https://app.magickidsinstitute.com/book/pediatrics?visit=flu&lang={lang}',
    text: {
      he: { badge: 'חדש במרפאת הילדים', title: 'חיסוני השפעת התחילו', body: 'עונת חיסוני השפעת נפתחה במרפאת הילדים של ד״ר בסים נמוז. קבעו תור לחיסון לילדכם בלחיצה אחת – הביקור קצר ומתקיים בתופיק זיאד 21, שפרעם.', button: 'לקביעת תור לחיסון שפעת', close: 'סגירה' },
      ar: { badge: 'جديد في عيادة الأطفال', title: 'بدأت تطعيمات الإنفلونزا', body: 'افتُتح موسم تطعيم الإنفلونزا في عيادة الأطفال عند د. بسيم نموز. احجزوا موعدًا لتطعيم طفلكم بضغطة واحدة – الزيارة قصيرة وتتم في توفيق زياد 21، شفاعمرو.', button: 'لحجز موعد لتطعيم الإنفلونزا', close: 'إغلاق' },
      en: { badge: 'New at the pediatric clinic', title: 'Flu vaccinations have started', body: 'Flu season vaccinations are open at Dr. Baseem Namouz\'s pediatric clinic. Book your child\'s shot in one click – a short visit at 21 Tawfiq Ziad St., Shefa-Amr.', button: 'Book a flu vaccination', close: 'Close' }
    }
  },
  google: {
    analyticsId: '',
    searchConsoleVerification: '',
    calendarBookingUrl: '',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=%D7%AA%D7%95%D7%A4%D7%99%D7%A7%20%D7%96%D7%99%D7%90%D7%93%2021%20%D7%A9%D7%A4%D7%A8%D7%A2%D7%9D'
  }
};
