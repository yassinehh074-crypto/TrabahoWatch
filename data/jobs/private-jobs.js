/* ============================================================
   DATA/JOBS/PRIVATE-JOBS.JS — Private sector job listings
   Sources: Company career pages, JobStreet PH, LinkedIn PH
   Salary data: Market rates 2026 (verified from job postings)
   Last updated: 2026-05-01
   TrabahoWatch v1.0
   ============================================================ */

window.__TrabahoPrivateJobs = [

  /* ══════════════════════════════════════════════════════════
     1. BPO CSR — CONCENTRIX BGC
        Source: careers.concentrix.com
     ══════════════════════════════════════════════════════════ */
  {
    id:          'bpo-csr-concentrix-bgc-2026',
    sector:      'private',
    category:    'bpo',
    tier:        1,
    status:      'open',

    title:       'Customer Service Representative (Voice)',
    agency:      'Concentrix Philippines — BGC, Taguig',
    location:    'Bonifacio Global City, Taguig',
    region:      'ncr',

    salary:      20000,
    salaryMin:   20000,
    salaryMax:   25000,
    salaryText:  '₱20,000–₱25,000/month + night differential',

    published:   '2026-05-01',
    deadline:    '2026-06-30',

    description: [
      'Concentrix Philippines is one of the largest BPO employers ',
      'in the country with operations across Metro Manila, Cebu, ',
      'and Davao. This Customer Service Representative (Voice) ',
      'position is for a US-based financial services account ',
      'based in its BGC, Taguig site. CSRs handle inbound calls ',
      'from US customers regarding account inquiries, billing, ',
      'disputes, and general customer service. Work schedule is ',
      'predominantly night shift (US hours: 8PM–5AM PHT). ',
      'Concentrix offers one of the most competitive compensation ',
      'packages in the BPO industry including HMO from Day 1, ',
      'paid training, and a clear career progression path from ',
      'CSR to Senior CSR, Quality Analyst, and Team Leader.'
    ].join(''),

    requirements: [
      'At least 2 years college education or Senior High School graduate (Grade 12 completer)',
      'Excellent English communication skills — neutral accent preferred for voice accounts',
      'Basic computer proficiency (typing speed: at least 25 WPM)',
      'Must be willing to work night shift (US time zones) and holidays',
      'No BPO experience required — paid training provided (3–6 weeks)',
      'Must pass initial voice screening, assessment, and final interview',
      'Amenable to work onsite in BGC, Taguig',
      'Able to handle high-volume inbound calls professionally'
    ],

    documents: [
      'Resume / CV (1–2 pages)',
      'Any valid government-issued ID (PhilSys, SSS, GSIS, Passport, Driver\'s License)',
      'TIN (Tax Identification Number) — for payroll processing',
      'SSS/GSIS number',
      'PhilHealth number',
      'Pag-IBIG MID number',
      'Bank account or e-wallet for payroll (Maya, GCash, or any bank)',
      'NBI Clearance (usually required before onboarding, not at application)'
    ],

    howToApply: [
      {
        title: 'Apply Online at Concentrix Careers',
        body:  'Visit careers.concentrix.com and search for "Customer Service Representative Philippines" or directly visit the BGC Taguig site walk-in recruitment: Concentrix BGC, 31st Street corner 2nd Avenue, BGC, Taguig. Walk-in hours: Monday to Friday, 9AM–5PM.'
      },
      {
        title: 'Initial Phone Screening',
        body:  'After submitting your application, a Concentrix recruiter will call you for an initial voice screening (3–5 minutes). This assesses your English communication skills and availability. Make sure you are in a quiet location when you receive the call.'
      },
      {
        title: 'Versant or SVAR Assessment',
        body:  'Qualified candidates take a automated voice assessment (Versant or SVAR) measuring pronunciation, fluency, and comprehension. Practice reading English texts aloud beforehand.'
      },
      {
        title: 'Final Interview with Operations',
        body:  'Pass the assessment and you proceed to a face-to-face or video interview with a Concentrix Operations Manager. Dress professionally. Questions cover customer service scenarios, handling difficult callers, and work availability.'
      },
      {
        title: 'Job Offer and Onboarding',
        body:  'Successful applicants receive a formal job offer within 1–3 business days. Training starts within 1–2 weeks. Pre-employment requirements (NBI, medical) are completed during the training period at Concentrix\'s expense.'
      }
    ],

    tags: [
      'BPO', 'call center', 'CSR', 'customer service',
      'voice', 'night shift', 'Concentrix', 'BGC', 'Taguig',
      'ncr', 'private', 'no experience', 'fresh graduate',
      'financial services', 'US account'
    ],

    sourceUrl: 'https://careers.concentrix.com',
    benefits: [
      'HMO coverage from Day 1 (with 1 free dependent upon regularization)',
      'Night shift differential: 10% premium pay (10PM–6AM)',
      'Monthly performance incentives: ₱1,000–₱5,000',
      'Paid training (3–6 weeks) at full salary',
      'SSS, PhilHealth, Pag-IBIG contributions',
      '13th month pay',
      'Annual merit increase (performance-based)',
      'Bereavement leave, solo parent leave',
      'Concentrix employee discounts and wellness programs',
      'Clear career progression: CSR → Senior CSR → QA / SME → Team Leader'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     2. BPO COMMUNICATIONS TRAINER — MAKATI
        Source: JobStreet PH / LinkedIn PH
     ══════════════════════════════════════════════════════════ */
  {
    id:          'bpo-comms-trainer-makati-2026',
    sector:      'private',
    category:    'bpo',
    tier:        2,
    status:      'open',

    title:       'Communications Trainer',
    agency:      'TTEC Philippines — Makati City',
    location:    'Makati City, NCR',
    region:      'ncr',

    salary:      35000,
    salaryMin:   30000,
    salaryMax:   40000,
    salaryText:  '₱30,000–₱40,000/month',

    published:   '2026-05-01',
    deadline:    '2026-06-30',

    description: [
      'TTEC Philippines (formerly TeleTech) is hiring a Communications ',
      'Trainer for its Makati City operations. The Communications Trainer ',
      'is responsible for facilitating English language, accent, and ',
      'communication skills training for newly hired BPO agents during ',
      'the pre-process and nesting phases. Trainers design and deliver ',
      'training modules covering American English pronunciation, ',
      'grammar, business writing, customer service communication, ',
      'de-escalation techniques, and cultural sensitivity for ',
      'US, UK, and Australian accounts. This role requires at least ',
      '2 years of BPO training experience and a demonstrated ability ',
      'to develop and deliver engaging adult learning programs.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in any field (Communication Arts, Education, or Linguistics preferred)',
      'At least 2 years of BPO training experience (communications or language trainer)',
      'Excellent English communication skills — near-native American English proficiency',
      'Strong platform and facilitation skills with ability to manage training classes of 15–20 agents',
      'Knowledgeable in adult learning principles and instructional design',
      'Experience in developing training modules, lesson plans, and learning materials',
      'Proficient in MS Office (Word, PowerPoint, Excel) and LMS platforms',
      'Amenable to shifting schedules aligned with US operations',
      'TNA (Training Needs Analysis) and SLA (Service Level Agreement) knowledge preferred'
    ],

    documents: [
      'Updated resume/CV highlighting training experience',
      'Portfolio of training materials, modules, or learning designs (if available)',
      'Valid government-issued ID',
      'TIN, SSS, PhilHealth, Pag-IBIG numbers',
      'NBI Clearance (for pre-employment)',
      'Certificate of Employment from previous BPO company',
      'Proof of training certifications (Trainer\'s Training, Facilitation Skills, etc.)'
    ],

    howToApply: [
      {
        title: 'Apply via TTEC Careers or JobStreet',
        body:  'Visit ttec.com/careers or search "Communications Trainer TTEC Philippines" on JobStreet (jobstreet.com.ph) or LinkedIn. You may also walk in to TTEC Makati: TTEC Philippines, 18th Floor, Ayala Tower One, Ayala Avenue, Makati City.'
      },
      {
        title: 'Resume Screening and Initial Interview',
        body:  'A TTEC recruiter reviews your resume focusing on your training background. Initial phone or video interview assesses your English proficiency, training experience, and availability.'
      },
      {
        title: 'Training Demo',
        body:  'This is the most critical step: you are given a topic (e.g., "American vs. Philippine English pronunciation differences") and asked to conduct a 10–15 minute demo training session before a panel of Training Managers. Prepare materials in advance.'
      },
      {
        title: 'Final Interview and Job Offer',
        body:  'Successful candidates meet the Training Manager and Operations Director. Job offer follows within 3–5 business days. Start date is typically within 2 weeks of offer acceptance.'
      }
    ],

    tags: [
      'BPO trainer', 'communications trainer', 'language trainer',
      'accent training', 'TTEC', 'Makati', 'ncr',
      'private', 'training', 'facilitation', 'adult learning',
      'instructional design', 'American English'
    ],

    sourceUrl: 'https://ttec.com/careers',
    benefits: [
      'HMO (medical insurance) from Day 1 with dependents',
      'SSS, PhilHealth, Pag-IBIG contributions',
      '13th month pay',
      'Night shift differential (if applicable)',
      'Performance bonuses and incentives',
      'Training allowance and professional development budget',
      'Annual salary review',
      'TTEC employee recognition programs',
      'Paid vacation and sick leaves'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     3. JUNIOR SOFTWARE DEVELOPER — ORTIGAS
        Source: JobStreet PH / Kalibrr
     ══════════════════════════════════════════════════════════ */
  {
    id:          'jr-software-dev-ortigas-2026',
    sector:      'private',
    category:    'tech',
    tier:        1,
    status:      'open',

    title:       'Junior Software Developer',
    agency:      'Exist Software Labs — Ortigas Center, Pasig',
    location:    'Ortigas Center, Pasig City',
    region:      'ncr',

    salary:      35000,
    salaryMin:   30000,
    salaryMax:   45000,
    salaryText:  '₱30,000–₱45,000/month',

    published:   '2026-04-25',
    deadline:    '2026-07-25',

    description: [
      'Exist Software Labs is a homegrown Philippine technology ',
      'company delivering enterprise software solutions to clients ',
      'across the Asia-Pacific region. Founded in 1994, Exist has ',
      'built a reputation for delivering high-quality Java, ',
      '.NET, and cloud-based enterprise applications. The Junior ',
      'Software Developer position is open to fresh graduates or ',
      'developers with up to 2 years of experience. You will work ',
      'in an Agile team environment alongside senior developers, ',
      'architects, and QA engineers developing web applications, ',
      'APIs, and enterprise systems for local and international ',
      'clients. Hybrid work arrangement: 3 days onsite in Ortigas, ',
      '2 days work-from-home.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Computer Science, Information Technology, Computer Engineering, or related field',
      'Proficiency in at least one programming language: Java, JavaScript (Node.js/React), Python, or C#/.NET',
      'Basic knowledge of relational databases (MySQL, PostgreSQL, or MS SQL Server)',
      'Understanding of software development fundamentals: OOP, data structures, algorithms',
      'Familiarity with version control systems (Git/GitHub)',
      'Basic knowledge of REST APIs',
      'Ability to work in an Agile/Scrum team environment',
      'Strong problem-solving skills and attention to detail',
      'Good communication skills in English',
      'Willing to work in Ortigas Center, Pasig (hybrid: 3 days onsite)'
    ],

    documents: [
      'Updated resume/CV with GitHub profile or portfolio link',
      'Transcript of Records and Diploma',
      'Valid government-issued ID',
      'TIN, SSS, PhilHealth, Pag-IBIG numbers',
      'NBI Clearance (before onboarding)',
      'Technical portfolio, GitHub projects, or certifications (AWS, Oracle, Microsoft) preferred'
    ],

    howToApply: [
      {
        title: 'Apply via Kalibrr or JobStreet',
        body:  'Apply at exist.com/careers or through Kalibrr (kalibrr.com) and JobStreet (jobstreet.com.ph). Search "Junior Software Developer Exist Software" or visit Exist\'s Ortigas office: 12th Floor, Robinson Summit Center, Ayala Avenue Extension, Ortigas, Pasig.'
      },
      {
        title: 'Online Application and Resume Screening',
        body:  'Submit your resume with a GitHub portfolio link. Highlighting personal projects, open-source contributions, or internship projects significantly increases your chances even without commercial experience.'
      },
      {
        title: 'Technical Assessment',
        body:  'Shortlisted candidates complete an online coding assessment (1–2 hours) covering: basic algorithms, OOP concepts, SQL queries, and a small coding problem. Practice on HackerRank or LeetCode beforehand.'
      },
      {
        title: 'Technical Interview with Senior Developer',
        body:  'A face-to-face or video interview with a Senior Developer or Tech Lead covering your technical assessment, code review, and conceptual questions on the technologies listed in the job description.'
      },
      {
        title: 'HR Interview and Job Offer',
        body:  'Final HR interview covering compensation expectations, work arrangement, and company culture. Job offer within 3–5 business days. Onboarding starts within 2 weeks.'
      }
    ],

    tags: [
      'software developer', 'junior developer', 'Java',
      'JavaScript', 'web development', 'Exist Software Labs',
      'Ortigas', 'Pasig', 'ncr', 'tech', 'private',
      'hybrid work', 'Agile', 'fresh graduate', 'IT'
    ],

    sourceUrl: 'https://exist.com/careers',
    benefits: [
      'HMO medical coverage (with dependents)',
      'SSS, PhilHealth, Pag-IBIG contributions',
      '13th month pay',
      'Hybrid work arrangement (3 days onsite, 2 WFH)',
      'Annual performance salary review',
      'Training budget for certifications (AWS, Oracle, Microsoft)',
      'Technical learning programs and mentorship',
      'Exist employee stock ownership plan (ESOP) for regularized employees',
      'Paid vacation and sick leaves',
      'Company events and team building activities'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     4. FINANCIAL ANALYST — BDO UNIBANK
        Source: bdo.com.ph/careers
     ══════════════════════════════════════════════════════════ */
  {
    id:          'finance-analyst-bdo-2026',
    sector:      'private',
    category:    'finance',
    tier:        2,
    status:      'open',

    title:       'Financial Analyst',
    agency:      'BDO Unibank, Inc. — Makati Head Office',
    location:    'Makati City, NCR',
    region:      'ncr',

    salary:      35000,
    salaryMin:   30000,
    salaryMax:   45000,
    salaryText:  '₱30,000–₱45,000/month',

    published:   '2026-04-15',
    deadline:    '2026-06-15',

    description: [
      'BDO Unibank is the largest bank in the Philippines by ',
      'assets, deposits, and branch network. The Financial Analyst ',
      'position at BDO\'s Makati Head Office is part of the ',
      'Finance and Treasury Group responsible for financial ',
      'planning and analysis, management reporting, budgeting ',
      'and forecasting, and regulatory reporting to the BSP ',
      '(Bangko Sentral ng Pilipinas). The role interfaces with ',
      'various business units to consolidate financial data, ',
      'prepare financial models, analyze variances, and produce ',
      'executive-level management reports. CPA licensure is ',
      'strongly preferred and results in a higher compensation offer.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Accountancy, Financial Management, or Economics',
      'Certified Public Accountant (CPA) license strongly preferred — higher salary band for CPA holders',
      'At least 1–2 years of experience in financial analysis, management accounting, or bank operations preferred (fresh CPA graduates accepted)',
      'Advanced proficiency in Microsoft Excel (VLOOKUP, pivot tables, financial modeling)',
      'Knowledge of BSP regulations, Philippine Financial Reporting Standards (PFRS), and basic banking operations preferred',
      'Strong analytical and quantitative skills',
      'Excellent written and verbal communication in English',
      'Amenable to work onsite in Makati (5 days/week)',
      'Detail-oriented with ability to meet tight reporting deadlines'
    ],

    documents: [
      'Updated resume/CV',
      'Certified true copy of CPA certificate and PRC ID (if applicable)',
      'Transcript of Records and Diploma',
      'Valid government-issued ID',
      'TIN, SSS, PhilHealth, Pag-IBIG numbers',
      'NBI Clearance (for pre-employment)',
      'Certificate of Employment from previous employer (if applicable)',
      'CPA board result (if newly passed)'
    ],

    howToApply: [
      {
        title: 'Apply via BDO Careers Portal',
        body:  'Visit bdo.com.ph and go to the Careers section, or apply directly at the BDO Head Office: BDO Corporate Center, 7899 Makati Avenue, Makati City. You may also apply via JobStreet (jobstreet.com.ph) by searching "Financial Analyst BDO."'
      },
      {
        title: 'Application Screening',
        body:  'BDO HR screens applications based on educational background, CPA status, and relevant experience. CPA holders and those with banking/finance experience are prioritized. Resume should clearly highlight Excel skills and financial analysis work.'
      },
      {
        title: 'Written Examination',
        body:  'Shortlisted applicants take a comprehensive written examination covering: accounting principles (PFRS), financial analysis, basic banking concepts, and analytical/logical reasoning. Duration: 2–3 hours.'
      },
      {
        title: 'Panel Interview with Finance Group',
        body:  'Technical interview with the Finance Group Manager and HR covering your examination performance, financial analysis methodology, knowledge of banking regulations, and career plans.'
      },
      {
        title: 'Background Check and Job Offer',
        body:  'BDO conducts thorough background and credit checks on all finalists (standard for banking industry). Clean credit history is important. Job offer follows within 5–7 business days of final interview.'
      }
    ],

    tags: [
      'financial analyst', 'BDO', 'banking', 'finance',
      'CPA', 'accounting', 'Makati', 'ncr', 'private',
      'treasury', 'BSP', 'PFRS', 'management reporting',
      'budgeting', 'forecasting'
    ],

    sourceUrl: 'https://bdo.com.ph/careers',
    benefits: [
      'HMO medical coverage (with dependents)',
      'Group life insurance',
      'SSS, PhilHealth, Pag-IBIG contributions',
      '13th month pay',
      'Annual performance bonus',
      'Rice allowance',
      'Staff loan privileges at preferential rates (housing, car, personal)',
      'BDO Unibank retirement plan',
      'Paid vacation leave (15 days) and sick leave (15 days)',
      'Annual salary review',
      'Training and professional development programs'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     5. STAFF NURSE — ST. LUKE'S MEDICAL CENTER
        Source: stlukesmedical.com.ph/careers
     ══════════════════════════════════════════════════════════ */
  {
    id:          'staff-nurse-st-lukes-2026',
    sector:      'private',
    category:    'healthcare',
    tier:        2,
    status:      'open',

    title:       'Staff Nurse',
    agency:      'St. Luke\'s Medical Center — Quezon City',
    location:    'Quezon City, NCR',
    region:      'ncr',

    salary:      25000,
    salaryMin:   22000,
    salaryMax:   30000,
    salaryText:  '₱22,000–₱30,000/month',

    published:   '2026-05-01',
    deadline:    '2026-07-01',

    description: [
      'St. Luke\'s Medical Center is one of the Philippines\' ',
      'leading tertiary private hospitals, consistently ranked ',
      'among the top hospitals in Asia. St. Luke\'s Quezon City ',
      'campus is a 650-bed state-of-the-art facility offering ',
      'comprehensive medical and surgical services. Staff Nurses ',
      'at St. Luke\'s are responsible for delivering direct ',
      'patient care following the nursing process, administering ',
      'medications and treatments, implementing physician\'s orders, ',
      'maintaining accurate patient records in the electronic ',
      'health record (EHR) system, educating patients and families ',
      'about their conditions and care plans, and collaborating ',
      'with the multidisciplinary team. St. Luke\'s follows ',
      'Joint Commission International (JCI) accreditation standards — ',
      'the highest international hospital quality standard. ',
      'Working at St. Luke\'s is excellent preparation for ',
      'international nursing careers in Saudi Arabia, Singapore, ',
      'Canada, and the UK.'
    ].join(''),

    requirements: [
      'Bachelor of Science in Nursing (BSN) from a CHED-recognized institution',
      'Valid PRC Nursing license — current, not expired',
      'NLE (Nurse Licensure Examination) passer',
      'Basic Life Support (BLS) certification — current (within 2 years)',
      'Intravenous Therapy (IV) training certificate',
      'At least 6 months to 1 year of clinical experience preferred (fresh NLE passers accepted for training positions)',
      'Proficient in electronic health records (EHR) preferred',
      'Excellent written and verbal communication in English',
      'Willing to work rotating shifts (morning, afternoon, night)',
      'Physically and mentally fit for hospital duties'
    ],

    documents: [
      'Resume/CV with passport-size photo',
      'Certified true copy of PRC Nursing ID and Board Certificate',
      'Certified true copy of BSN Transcript of Records and Diploma',
      'NBI Clearance (original, within 3 months)',
      'Police Clearance (within 3 months)',
      'Medical Clearance from a licensed physician (CBC, urinalysis, chest X-ray, drug test)',
      'BLS certificate (current)',
      'IV therapy certificate',
      'Certificates of relevant trainings and continuing nursing education',
      '2x2 ID photos (6 pieces)',
      'PSA Birth Certificate'
    ],

    howToApply: [
      {
        title: 'Apply at St. Luke\'s Careers Portal',
        body:  'Visit stlukesmedical.com.ph/careers and apply for open Staff Nurse positions. You may also submit your application in person at the St. Luke\'s Human Resources Department: 279 E. Rodriguez Sr. Ave., Quezon City, 2nd Floor, Main Building. Walk-in hours: Monday to Friday, 8AM–4PM.'
      },
      {
        title: 'Applicant Screening',
        body:  'St. Luke\'s HR screens all applications based on PRC license validity, educational background, and clinical experience. Fresh NLE passers with passing rates from top nursing schools are accepted. Ensure your PRC license is current.'
      },
      {
        title: 'Written Nursing Competency Exam',
        body:  'Shortlisted applicants take a written exam covering: nursing fundamentals, pharmacology, medical-surgical nursing, and clinical scenarios. Duration: 1.5–2 hours. Review core nursing subjects and St. Luke\'s nursing standards.'
      },
      {
        title: 'Panel Interview',
        body:  'A structured interview with the Nursing Department Head and HR covering your clinical experience, patient care philosophy, knowledge of JCI standards, and specialty interest areas (ICU, OR, ER, medical-surgical wards).'
      },
      {
        title: 'Pre-Employment Requirements and Orientation',
        body:  'Successful applicants complete comprehensive pre-employment medical examination at St. Luke\'s Occupational Health Services. New hires attend a hospital orientation and nursing-specific onboarding before floor assignment.'
      }
    ],

    tags: [
      'staff nurse', 'nursing', 'St. Luke\'s', 'private hospital',
      'JCI', 'Quezon City', 'ncr', 'private', 'healthcare',
      'NLE', 'PRC', 'clinical', 'OFW preparation',
      'BLS', 'IV therapy', 'rotating shift'
    ],

    sourceUrl: 'https://stlukesmedical.com.ph/careers',
    benefits: [
      'HMO medical coverage (for employee and 1 dependent)',
      'SSS, PhilHealth, Pag-IBIG contributions',
      '13th month pay',
      'Night shift premium and overtime pay',
      'Continuing Education benefits (seminars, workshops)',
      'Annual salary review',
      'Staff meal discounts at hospital canteen',
      'Employee hospitalization discount at St. Luke\'s',
      'Paid vacation and sick leaves',
      'JCI-accredited hospital experience (valued internationally for OFW nursing)'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     6. RETAIL STORE SUPERVISOR — SM RETAIL
        Source: smretail.com.ph/careers
        STATUS: PAUSED — position temporarily on hold
     ══════════════════════════════════════════════════════════ */
  {
    id:          'retail-store-supervisor-sm-2026',
    sector:      'private',
    category:    'retail',
    tier:        3,
    status:      'paused',

    title:       'Store Supervisor',
    agency:      'SM Retail, Inc. — Various SM Mall Locations',
    location:    'Metro Manila (Multiple SM Mall Sites)',
    region:      'ncr',

    salary:      22000,
    salaryMin:   20000,
    salaryMax:   28000,
    salaryText:  '₱20,000–₱28,000/month',

    published:   '2026-03-15',
    deadline:    '2026-06-15',

    description: [
      'SM Retail, Inc. — the retail arm of SM Prime Holdings and ',
      'one of the largest retail networks in the Philippines — ',
      'periodically hires Store Supervisors for its SM Department ',
      'Store, SM Supermarket, SaveMore Market, and SM Home brands ',
      'across Metro Manila. The Store Supervisor is responsible ',
      'for managing day-to-day store operations, supervising ',
      'sales associates and service staff, ensuring customer ',
      'service standards, monitoring inventory and stock levels, ',
      'achieving sales targets, implementing promotional campaigns, ',
      'and maintaining store appearance standards. This position ',
      'is currently paused pending SM Retail\'s Q3 2026 headcount ',
      'planning. Applications are being pre-screened for future ',
      'deployment when positions open.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Business Administration, Marketing, or related field (preferred but not required for candidates with strong retail experience)',
      'At least 2 years of retail supervisory or management experience',
      'Strong customer service orientation and interpersonal skills',
      'Leadership and team management skills (5–20 staff)',
      'Proficient in retail POS systems and basic inventory management',
      'Amenable to shifting schedules including weekends and holidays',
      'Willing to be assigned to any SM mall in Metro Manila',
      'Target-driven with ability to analyze sales data',
      'Good organizational and multitasking abilities'
    ],

    documents: [
      'Updated resume/CV with photo',
      'Transcript of Records and Diploma (if college graduate)',
      'Valid government-issued ID',
      'TIN, SSS, PhilHealth, Pag-IBIG numbers',
      'NBI Clearance (for pre-employment)',
      'Certificate of Employment from previous retail employer',
      'Character references (2 professional references)'
    ],

    howToApply: [
      {
        title: 'Note: Position Currently Paused',
        body:  'This position is temporarily on hold pending SM Retail\'s Q3 2026 headcount approval. You may submit a pre-application to be prioritized when positions open. Visit smretail.com.ph/careers or the SM Talent Acquisition Office at SM Corporate Offices, SM Mall of Asia Complex, Pasay City.'
      },
      {
        title: 'Submit Pre-Application Online',
        body:  'Apply at smretail.com.ph/careers to be placed in SM Retail\'s talent pool. When positions open, pre-screened candidates are contacted first. Alternatively, submit your resume to SM\'s kiosk recruitment stations at major SM malls.'
      },
      {
        title: 'Recruitment Assessment',
        body:  'SM Retail uses a structured recruitment process: written exam (retail mathematics, customer service scenarios), group dynamics/role play, and panel interview. Assessment centers are held at SM Corporate Offices.'
      },
      {
        title: 'Final Interview and Site Assignment',
        body:  'Successful candidates are interviewed by SM Retail Area Managers. Job offer includes specific mall assignment based on vacancy and candidate preference. Training follows at the SM Retail Training Center.'
      }
    ],

    tags: [
      'store supervisor', 'retail', 'SM Retail', 'SM mall',
      'supervisor', 'customer service', 'metro manila', 'ncr',
      'private', 'paused', 'SM Supermarket', 'SaveMore',
      'department store', 'management'
    ],

    sourceUrl: 'https://smretail.com.ph/careers',
    benefits: [
      'HMO medical coverage',
      'SSS, PhilHealth, Pag-IBIG contributions',
      '13th month pay',
      'SM employee shopping discount (up to 20%)',
      'Performance incentives and sales bonuses',
      'Annual salary review',
      'SM Retail training and career development programs',
      'Paid vacation and sick leaves',
      'SM employee cooperative membership'
    ]
  }

];