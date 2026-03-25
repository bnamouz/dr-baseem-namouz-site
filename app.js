(function () {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const header = document.getElementById('header');
  const fadeElements = document.querySelectorAll('.fade-in');
  const langButtons = document.querySelectorAll('[data-lang-switch]');

  const translations = {
    he: {
      pageTitle: 'מכון ילדי הקסם | בהנהלת ד״ר נמוז בסים',
      pageDescription: 'מכון ילדי הקסם בהנהלת ד״ר נמוז בסים. ליווי רפואי מקיף, מענה אישי לילדים ולהורים, ואבחון הפרעות קשב וריכוז בגישה מקצועית ורגישה.',
      dir: 'rtl',
      skip: 'דלג לתוכן הראשי',
      'header.logo_name': 'מכון ילדי הקסם',
      'header.logo_sub': 'בהנהלת ד״ר נמוז בסים',
      'nav.vision': 'למה אלינו',
      'nav.services': 'תחומי טיפול',
      'nav.director': 'היכרות',
      'nav.adhd': 'קשב וריכוז',
      'nav.portal': 'אזור מטופלים',
      'nav.contact': 'יצירת קשר',
      'hero.badge': 'מכון ילדי הקסם',
      'hero.title': 'מכון ילדי הקסם <span>בהנהלת ד״ר נמוז בסים</span>',
      'hero.subtitle': 'מרחב מקצועי, רגיש ומכבד לילדים, להורים ולמשפחה כולה, עם מענה רפואי מקיף, ליווי אישי ואפשרות כניסה נוחה לאזור המטופלים.',
      'hero.booking': 'קביעת תור',
      'hero.portal': 'אזור מטופלים',
      'hero.director': 'הכירו את ד״ר בסים',
      'trust.one_number': 'ליווי',
      'trust.one_label': 'אישי לכל משפחה',
      'trust.two_number': 'מענה',
      'trust.two_label': 'לקשב וריכוז',
      'trust.three_number': 'גישה',
      'trust.three_label': 'רגישה ומקצועית',
      'trust.four_number': 'כניסה',
      'trust.four_label': 'נוחה לאזור מטופלים',
      'vision.eyebrow': 'החזון שלנו',
      'vision.title': 'מקום שמחבר בין מקצועיות, הקשבה וביטחון',
      'vision.desc': 'מכון ילדי הקסם נבנה כדי להעניק לילדים ולהורים תחושת רוגע, הכוונה מדויקת ודרך ברורה לקבלת טיפול, אבחון וליווי לאורך זמן.',
      'vision.card1_title': 'יחס חם ומכבד',
      'vision.card1_text': 'כל ילד וכל הורה מקבלים הקשבה אמיתית, ליווי רגוע והסברים ברורים בגובה העיניים.',
      'vision.card2_title': 'מענה מקצועי ומדויק',
      'vision.card2_text': 'אבחון, טיפול וליווי רפואי מתוך אחריות מקצועית, ניסיון וראייה רחבה של צרכי הילד והמשפחה.',
      'vision.card3_title': 'גישה מהירה ונוחה',
      'vision.card3_text': 'קביעת תור, יצירת קשר וכניסה לאזור המטופלים בצורה פשוטה, נגישה וברורה מכל מכשיר.',
      'services.eyebrow': 'מה תמצאו אצלנו',
      'services.title': 'תחומי הטיפול המרכזיים',
      'services.desc': 'המכון משלב ליווי רפואי, הערכה מקצועית, קשר רציף עם ההורים וגישה מותאמת לילדים ולבני נוער.',
      'services.item1': 'רפואת ילדים כללית',
      'services.item2': 'אבחון קשב וריכוז',
      'services.item3': 'ליווי הורים ומשפחה',
      'services.item4': 'בדיקות מעקב והתפתחות',
      'services.item5': 'הכוונה רפואית אישית',
      'services.item6': 'כניסה דיגיטלית לאזור מטופלים',
      'services.card1_text': 'מענה רפואי ראשוני, בדיקות שגרה והכוונה מקצועית לילדים בכל שלב.',
      'services.card2_text': 'אבחון מקיף עם הסתכלות רגישה ומדויקת על התפקוד של הילד בבית ובמסגרות.',
      'services.card3_text': 'שיח ברור, ליווי רגוע וכלים מעשיים שמחזקים את המשפחה כולה.',
      'services.card4_text': 'מעקב מסודר אחר גדילה, התפתחות וצרכים רפואיים לאורך זמן.',
      'services.card5_text': 'תוכנית ברורה ומותאמת אישית להמשך הדרך, עם מענה מדויק לשאלות ההורים.',
      'services.card6_text': 'כניסה פשוטה, נוחה וברורה למערכת המטופלים מכל מכשיר ובכל זמן.',
      'director.quote_title': 'הגישה שלנו',
      'director.quote_text': 'רפואה טובה לילדים מתחילה בהקשבה, בביטחון ובתחושה שיש מי שמלווה אתכם באמת לאורך הדרך.',
      'director.quote_signature': 'מכון ילדי הקסם בהנהלת ד״ר נמוז בסים',
      'director.eyebrow': 'בהנהלת ד״ר נמוז בסים',
      'director.title': 'הובלה רפואית עם לב אנושי',
      'director.text1': 'ד״ר נמוז בסים מוביל את המכון מתוך תפיסה שמחברת בין מקצועיות רפואית, יחס אישי, ותהליך ברור ומכבד עבור כל ילד והורה.',
      'director.text2': 'המכון נועד להיות מקום בטוח, אסתטי ונגיש, שבו אפשר לקבל ליווי רפואי, מענה בתחום קשב וריכוז, ותמיכה רציפה למשפחה כולה.',
      'director.tag1': 'רופא ילדים מומחה',
      'director.tag2': 'הכוונה אישית',
      'director.tag3': 'מענה למשפחה',
      'director.tag4': 'ליווי בקשב וריכוז',
      'contact.title': 'רוצים ליצור קשר עם המרפאה?',
      'contact.desc': 'אפשר לקבוע תור, לשלוח הודעת וואטסאפ למזכירת המרפאה, להיכנס לאזור המטופלים, או ליצור קשר טלפוני לכל שאלה.',
      'contact.whatsapp': 'קביעת תור בוואטסאפ',
      'contact.portal': 'אזור מטופלים',
      'contact.phone_label': 'טלפון:',
      'contact.mail_label': 'מייל:',
      'contact.address_label': 'כתובת:',
      'contact.address_value': 'רחוב תופיק זיאד 21, שפרעם',
      'contact.hours_label': 'תיאום:',
      'contact.hours_value': 'בתיאום מראש דרך המזכירה',
      'footer.logo_name': 'מכון ילדי הקסם',
      'footer.logo_sub': 'בהנהלת ד״ר נמוז בסים',
      'footer.desc': 'מקום שמחבר בין ליווי רפואי מקצועי, גישה אנושית וכניסה דיגיטלית נוחה להורים ולמטופלים.',
      'footer.nav_title': 'ניווט מהיר',
      'footer.contact_title': 'יצירת קשר',
      'footer.whatsapp': 'וואטסאפ למזכירה',
      'footer.portal': 'כניסה לאזור המטופלים',
      'footer.copy': '© 2026 מכון ילדי הקסם. כל הזכויות שמורות.'
    },
    ar: {
      pageTitle: 'معهد أطفال السحر | بإدارة الدكتور باسم نموز',
      pageDescription: 'معهد أطفال السحر بإدارة الدكتور باسم نموز. مرافقة طبية شاملة للأطفال والأهالي، وتشخيص اضطرابات الانتباه والتركيز بأسلوب مهني وإنساني.',
      dir: 'rtl',
      skip: 'تخطي إلى المحتوى الرئيسي',
      'header.logo_name': 'معهد أطفال السحر',
      'header.logo_sub': 'بإدارة الدكتور باسم نموز',
      'nav.vision': 'لماذا نحن',
      'nav.services': 'مجالات العلاج',
      'nav.director': 'تعرفوا علينا',
      'nav.adhd': 'الانتباه والتركيز',
      'nav.portal': 'منطقة المرضى',
      'nav.contact': 'تواصل',
      'hero.badge': 'معهد أطفال السحر',
      'hero.title': 'معهد أطفال السحر <span>بإدارة الدكتور باسم نموز</span>',
      'hero.subtitle': 'مساحة مهنية، حساسة ومحترمة للأطفال والأهالي، مع مرافقة طبية شاملة وإمكانية دخول مريحة إلى منطقة المرضى.',
      'hero.booking': 'حجز موعد',
      'hero.portal': 'منطقة المرضى',
      'hero.director': 'تعرفوا على الدكتور باسم',
      'trust.one_number': 'مرافقة',
      'trust.one_label': 'شخصية لكل عائلة',
      'trust.two_number': 'دعم',
      'trust.two_label': 'للانتباه والتركيز',
      'trust.three_number': 'نهج',
      'trust.three_label': 'مهني وإنساني',
      'trust.four_number': 'دخول',
      'trust.four_label': 'مريح لمنطقة المرضى',
      'vision.eyebrow': 'رؤيتنا',
      'vision.title': 'مكان يجمع بين المهنية، الإصغاء والطمأنينة',
      'vision.desc': 'أُنشئ معهد أطفال السحر ليمنح الأطفال والأهالي شعوراً بالهدوء، وتوجيهاً دقيقاً وطريقاً واضحاً للعلاج والتشخيص والمرافقة المستمرة.',
      'vision.card1_title': 'تعامل دافئ ومحترم',
      'vision.card1_text': 'كل طفل وكل ولي أمر يحصل على إصغاء حقيقي ومرافقة هادئة وشرح واضح وبسيط.',
      'vision.card2_title': 'استجابة مهنية دقيقة',
      'vision.card2_text': 'تشخيص وعلاج ومرافقة طبية بمسؤولية مهنية وخبرة ورؤية واسعة لاحتياجات الطفل والعائلة.',
      'vision.card3_title': 'وصول سريع ومريح',
      'vision.card3_text': 'حجز موعد، تواصل، ودخول إلى منطقة المرضى بشكل بسيط وواضح من أي جهاز.',
      'services.eyebrow': 'ماذا تجدون لدينا',
      'services.title': 'مجالات العلاج الأساسية',
      'services.desc': 'المعهد يجمع بين المرافقة الطبية، التقييم المهني، التواصل المستمر مع الأهل ونهج ملائم للأطفال واليافعين.',
      'services.item1': 'طب أطفال عام',
      'services.item2': 'تشخيص الانتباه والتركيز',
      'services.item3': 'مرافقة للأهل والعائلة',
      'services.item4': 'فحوصات متابعة وتطور',
      'services.item5': 'توجيه طبي شخصي',
      'services.item6': 'دخول رقمي لمنطقة المرضى',
      'services.card1_text': 'استجابة طبية أولية، فحوصات روتينية وتوجيه مهني للأطفال في كل مرحلة.',
      'services.card2_text': 'تشخيص شامل مع نظرة حساسة ودقيقة لأداء الطفل في البيت وفي الأطر المختلفة.',
      'services.card3_text': 'حوار واضح، مرافقة هادئة وأدوات عملية تدعم العائلة كلها.',
      'services.card4_text': 'متابعة منظمة للنمو والتطور والاحتياجات الطبية مع مرور الوقت.',
      'services.card5_text': 'خطة واضحة وشخصية للخطوات القادمة مع إجابات دقيقة لأسئلة الأهل.',
      'services.card6_text': 'دخول بسيط ومريح وواضح إلى نظام المرضى من أي جهاز وفي أي وقت.',
      'director.quote_title': 'نهجنا',
      'director.quote_text': 'الطب الجيد للأطفال يبدأ بالإصغاء، بالثقة، وبالشعور أن هناك من يرافقكم فعلاً طوال الطريق.',
      'director.quote_signature': 'معهد أطفال السحر بإدارة الدكتور باسم نموز',
      'director.eyebrow': 'بإدارة الدكتور باسم نموز',
      'director.title': 'قيادة طبية بقلب إنساني',
      'director.text1': 'يقود الدكتور باسم نموز المعهد من خلال رؤية تجمع بين المهنية الطبية، التعامل الشخصي، ومسار واضح ومحترم لكل طفل وولي أمر.',
      'director.text2': 'صُمم المعهد ليكون مكاناً آمناً، جميلاً ومتاحاً، يمكن من خلاله الحصول على مرافقة طبية، دعم في مجال الانتباه والتركيز، ومساندة متواصلة للعائلة كلها.',
      'director.tag1': 'طبيب أطفال مختص',
      'director.tag2': 'توجيه شخصي',
      'director.tag3': 'دعم للعائلة',
      'director.tag4': 'مرافقة في الانتباه والتركيز',
      'contact.title': 'هل ترغبون بالتواصل مع العيادة؟',
      'contact.desc': 'يمكنكم حجز موعد، إرسال رسالة واتساب لسكرتيرة العيادة، الدخول إلى منطقة المرضى، أو الاتصال هاتفياً لأي استفسار.',
      'contact.whatsapp': 'حجز موعد عبر واتساب',
      'contact.portal': 'منطقة المرضى',
      'contact.phone_label': 'الهاتف:',
      'contact.mail_label': 'البريد:',
      'contact.address_label': 'العنوان:',
      'contact.address_value': 'شارع توفيق زياد 21، شفاعمرو',
      'contact.hours_label': 'التنسيق:',
      'contact.hours_value': 'بالتنسيق المسبق عبر السكرتيرة',
      'footer.logo_name': 'معهد أطفال السحر',
      'footer.logo_sub': 'بإدارة الدكتور باسم نموز',
      'footer.desc': 'مكان يجمع بين المرافقة الطبية المهنية، النهج الإنساني، والدخول الرقمي المريح للأهالي والمرضى.',
      'footer.nav_title': 'تنقل سريع',
      'footer.contact_title': 'تواصل',
      'footer.whatsapp': 'واتساب للسكرتيرة',
      'footer.portal': 'الدخول إلى منطقة المرضى',
      'footer.copy': '© 2026 معهد أطفال السحر. جميع الحقوق محفوظة.'
    },
    en: {
      pageTitle: 'Magic Kids Institute | Directed by Dr. Baseem Namouz',
      pageDescription: 'Magic Kids Institute directed by Dr. Baseem Namouz. Comprehensive care for children and families, including ADHD assessment and compassionate medical guidance.',
      dir: 'ltr',
      skip: 'Skip to main content',
      'header.logo_name': 'Magic Kids Institute',
      'header.logo_sub': 'Directed by Dr. Baseem Namouz',
      'nav.vision': 'Why us',
      'nav.services': 'Services',
      'nav.director': 'About',
      'nav.adhd': 'ADHD',
      'nav.portal': 'Patient Portal',
      'nav.contact': 'Contact',
      'hero.badge': 'Magic Kids Institute',
      'hero.title': 'Magic Kids Institute <span>Directed by Dr. Baseem Namouz</span>',
      'hero.subtitle': 'A professional, respectful and welcoming space for children and families, with comprehensive medical support and easy access to the patient portal.',
      'hero.booking': 'Book an appointment',
      'hero.portal': 'Patient Portal',
      'hero.director': 'Meet Dr. Baseem',
      'trust.one_number': 'Care',
      'trust.one_label': 'for every family',
      'trust.two_number': 'Support',
      'trust.two_label': 'for ADHD care',
      'trust.three_number': 'Approach',
      'trust.three_label': 'professional and kind',
      'trust.four_number': 'Access',
      'trust.four_label': 'to the patient portal',
      'vision.eyebrow': 'Our vision',
      'vision.title': 'A place that blends expertise, listening and trust',
      'vision.desc': 'Magic Kids Institute was created to give children and parents calm, clear guidance, and a reliable path to care, assessment and long-term support.',
      'vision.card1_title': 'Warm and respectful care',
      'vision.card1_text': 'Every child and every parent receives genuine attention, calm guidance and clear explanations.',
      'vision.card2_title': 'Accurate professional support',
      'vision.card2_text': 'Assessment, treatment and medical guidance grounded in responsibility, experience and a broad understanding of each family’s needs.',
      'vision.card3_title': 'Fast and easy access',
      'vision.card3_text': 'Book appointments, contact the clinic, and enter the patient portal clearly and comfortably from any device.',
      'services.eyebrow': 'What we offer',
      'services.title': 'Main areas of care',
      'services.desc': 'The institute combines medical guidance, professional assessment, close family communication and a thoughtful approach for children and teens.',
      'services.item1': 'General pediatrics',
      'services.item2': 'ADHD assessment',
      'services.item3': 'Family guidance',
      'services.item4': 'Follow-up and developmental checks',
      'services.item5': 'Personal medical guidance',
      'services.item6': 'Digital patient portal access',
      'services.card1_text': 'Primary medical support, routine checkups and professional guidance for children at every stage.',
      'services.card2_text': 'Comprehensive assessment with a sensitive and accurate view of the child at home and in educational settings.',
      'services.card3_text': 'Clear communication, calm guidance and practical tools that strengthen the whole family.',
      'services.card4_text': 'Structured follow-up of growth, development and medical needs over time.',
      'services.card5_text': 'A clear and personalized plan forward, with precise answers to parents’ questions.',
      'services.card6_text': 'Simple, convenient and clear access to the patient system from any device at any time.',
      'director.quote_title': 'Our approach',
      'director.quote_text': 'Good pediatric care begins with listening, trust, and the feeling that someone is truly walking with you every step of the way.',
      'director.quote_signature': 'Magic Kids Institute directed by Dr. Baseem Namouz',
      'director.eyebrow': 'Directed by Dr. Baseem Namouz',
      'director.title': 'Medical leadership with a human heart',
      'director.text1': 'Dr. Baseem Namouz leads the institute with a vision that combines medical professionalism, personal care, and a respectful, clear process for every child and parent.',
      'director.text2': 'The institute is designed to be a safe, elegant and accessible place where families can receive medical support, ADHD-related care and ongoing guidance.',
      'director.tag1': 'Pediatric specialist',
      'director.tag2': 'Personal guidance',
      'director.tag3': 'Family support',
      'director.tag4': 'ADHD care',
      'contact.title': 'Would you like to contact the clinic?',
      'contact.desc': 'You can book an appointment, send a WhatsApp message to the clinic secretary, enter the patient portal, or call us with any question.',
      'contact.whatsapp': 'Book on WhatsApp',
      'contact.portal': 'Patient Portal',
      'contact.phone_label': 'Phone:',
      'contact.mail_label': 'Email:',
      'contact.address_label': 'Address:',
      'contact.address_value': '21 Tawfiq Ziad Street, Shefa-Amr',
      'contact.hours_label': 'Coordination:',
      'contact.hours_value': 'By prior arrangement through the secretary',
      'footer.logo_name': 'Magic Kids Institute',
      'footer.logo_sub': 'Directed by Dr. Baseem Namouz',
      'footer.desc': 'A place that connects professional medical guidance, a human approach, and convenient digital access for parents and patients.',
      'footer.nav_title': 'Quick links',
      'footer.contact_title': 'Contact',
      'footer.whatsapp': 'Secretary WhatsApp',
      'footer.portal': 'Enter patient portal',
      'footer.copy': '© 2026 Magic Kids Institute. All rights reserved.'
    }
  };

  let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let currentLanguage = 'he';
  let isMenuOpen = false;

  root.setAttribute('data-theme', currentTheme);

  function updateThemeIcon() {
    if (!themeToggle) return;
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      themeToggle.setAttribute('aria-label', currentLanguage === 'en' ? 'Switch to light mode' : currentLanguage === 'ar' ? 'الانتقال إلى الوضع الفاتح' : 'החלף למצב בהיר');
    } else {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeToggle.setAttribute('aria-label', currentLanguage === 'en' ? 'Switch to dark mode' : currentLanguage === 'ar' ? 'الانتقال إلى الوضع الداكن' : 'החלף למצב כהה');
    }
  }

  function applyLanguage(lang) {
    const selected = translations[lang] || translations.he;
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = selected.dir;
    document.title = selected.pageTitle;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', selected.pageDescription);
    if (ogTitle) ogTitle.setAttribute('content', selected.pageTitle);
    if (ogDescription) ogDescription.setAttribute('content', selected.pageDescription);

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const value = selected[key];
      if (!value) return;
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    });

    langButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.langSwitch === lang);
    });

    updateThemeIcon();
  }

  function toggleMenu() {
    if (!mobileNav || !mobileMenuBtn) return;
    isMenuOpen = !isMenuOpen;
    mobileNav.classList.toggle('is-open', isMenuOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(isMenuOpen));

    if (isMenuOpen) {
      mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      document.body.style.overflow = '';
    }
  }

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('header--scrolled', scrollY > 20);
    }
  }

  function revealAllSections() {
    fadeElements.forEach((el, index) => {
      window.setTimeout(() => {
        el.classList.add('is-visible');
      }, Math.min(index * 40, 320));
    });
  }

  updateThemeIcon();
  applyLanguage('he');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateThemeIcon();
    });
  }

  langButtons.forEach((button) => {
    button.addEventListener('click', function () {
      applyLanguage(button.dataset.langSwitch || 'he');
    });
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function () {
        if (isMenuOpen) toggleMenu();
      });
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  revealAllSections();
  window.addEventListener('load', revealAllSections);
  window.addEventListener('pageshow', revealAllSections);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    fadeElements.forEach((el) => el.classList.add('is-visible'));
  }

  setTimeout(function () {
    fadeElements.forEach((el) => el.classList.add('is-visible'));
  }, 800);

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      fadeElements.forEach((el) => el.classList.add('is-visible'));
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
