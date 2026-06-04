/* ============================================================
   DATA/JOBS/OFW-JOBS.JS — OFW job listings
   Sources: DMW job orders, POEA verified listings,
            hospital/employer career pages, verified agencies
   Salary data: BSP reference rates (June 2026)
   BSP Exchange Rates used:
     SAR 1 = ₱15.20  |  AED 1 = ₱15.60
     JPY 1 = ₱0.40   |  CAD 1 = ₱42.00
   All OFW deployment must be through DMW-accredited agencies.
   Last updated: 2026-05-01
   TrabahoWatch v1.0
   ============================================================ */

window.__TrabahoOFWJobs = [

  /* ══════════════════════════════════════════════════════════
     1. REGISTERED NURSE — KING FAHAD MEDICAL CITY, RIYADH
        Source: kfmc.med.sa/en/careers
        Deployment: DMW-accredited Saudi healthcare agencies
     ══════════════════════════════════════════════════════════ */
  {
    id:          'rn-kfmc-riyadh-saudi-2026',
    sector:      'ofw',
    category:    'middle-east',
    tier:        1,
    status:      'open',

    title:       'Registered Nurse (Staff Nurse)',
    agency:      'King Fahad Medical City (KFMC) — Riyadh, Saudi Arabia',
    location:    'Riyadh, Saudi Arabia',
    region:      'middle-east',

    salary:      76000,
    salaryMin:   68400,
    salaryMax:   83600,
    salaryText:  'SAR 4,500–5,500/month (≈ ₱68,400–₱83,600 tax-free)',

    published:   '2026-04-01',
    deadline:    '2026-07-01',

    description: [
      'King Fahad Medical City (KFMC) is the largest hospital ',
      'complex in Saudi Arabia operated by the Saudi Ministry of ',
      'Health (MOH), located in Riyadh. The facility is a ',
      '1,200-bed multi-specialty tertiary hospital with JCI ',
      'accreditation serving as a national referral center for ',
      'complex medical cases. KFMC is actively recruiting ',
      'Filipino Registered Nurses for various clinical units ',
      'including Medical-Surgical, ICU, CCU, NICU, ER, OR, ',
      'and Oncology. Filipino nurses are highly regarded at ',
      'KFMC for their clinical competence, English proficiency, ',
      'and compassionate patient care. The hospital provides ',
      'a comprehensive benefits package including free furnished ',
      'accommodation on the hospital compound, return airfare ',
      'to the Philippines annually, and end-of-service gratuity. ',
      'This position is deployed through DMW-accredited ',
      'Philippine recruitment agencies authorized to recruit ',
      'for Saudi MOH facilities. All-in monthly compensation ',
      'including allowances can reach SAR 6,000–7,000 ',
      '(≈ ₱91,000–₱106,000/month tax-free).'
    ].join(''),

    requirements: [
      'Bachelor of Science in Nursing (BSN) from a CHED-recognized Philippine institution',
      'Valid PRC Nursing license (current, not expired)',
      'Minimum 2 years of clinical nursing experience in a hospital setting (post-licensure)',
      'Prometric / PEARSON VUE NCLEX — OR Saudi Prometric exam qualification (required for Saudi MOH)',
      'DataFlow credential verification completed (mandatory for Saudi healthcare — allow 6–10 weeks)',
      'DFA Apostille of all academic documents (TOR, Diploma, Board Certificate)',
      'Basic Life Support (BLS) certification — current',
      'Advanced Cardiac Life Support (ACLS) preferred for ICU/CCU/ER applicants',
      'Good physical and mental health',
      'Willing to live on the hospital compound in Riyadh',
      'Willing to sign a 2-year contract (renewable)'
    ],

    documents: [
      'Updated CV/resume (international format with photo)',
      'Certified true copy of PRC Nursing ID and Board Certificate (Apostilled by DFA)',
      'Certified true copy of BSN Transcript of Records and Diploma (Apostilled by DFA)',
      'DataFlow Credential Verification report (primary source verification)',
      'NBI Clearance — Apostilled by DFA (within 6 months)',
      'Valid Philippine Passport (must be valid for at least 18 months upon deployment)',
      'OWWA Membership receipt',
      'OEC (Overseas Employment Certificate / eOEC) from DMW',
      'PDOS Certificate (Pre-Departure Orientation Seminar — from OWWA)',
      'Medical clearance from POEA/DMW-accredited clinic (GAMCA for Saudi Arabia)',
      'BLS and ACLS certificates',
      'Certificate of Employment from current/previous Philippine hospital',
      '2x2 and passport-size photos (6 pieces each)'
    ],

    howToApply: [
      {
        title: 'Find a DMW-Accredited Recruitment Agency for KFMC',
        body:  'KFMC recruits through Philippine agencies accredited by the DMW (Department of Migrant Workers). Verify your agency at dmwph.com before engaging. Reputable agencies recruiting for Saudi MOH facilities include FAME (First Asia Manpower Exchange), Global Headstart, and others listed in the DMW verified agency database. Never pay fees to unverified agencies.'
      },
      {
        title: 'Start DataFlow Verification Early',
        body:  'DataFlow credential verification is MANDATORY for Saudi Arabia healthcare positions and takes 6–10 weeks. Submit your TOR, Diploma, and Board Certificate to DataFlow (dataflowgroup.com) immediately upon deciding to apply. This is your biggest timeline risk — start it first.'
      },
      {
        title: 'Get DFA Apostille on All Documents',
        body:  'All Philippine-issued documents (TOR, Diploma, Board Certificate, NBI Clearance) must have DFA Apostille before they are accepted in Saudi Arabia. Schedule at dfa.gov.ph/apostille. Processing takes 3–7 business days. Prepare 2 authenticated sets of each document.'
      },
      {
        title: 'GAMCA Medical Examination',
        body:  'Saudi Arabia requires the Gulf Approved Medical Centers Association (GAMCA) medical exam. This is a specific physical examination done only at GAMCA-accredited clinics in the Philippines (not just any government physician). Bring your passport and agency referral letter to the GAMCA clinic.'
      },
      {
        title: 'Prometric/HAAD Skills Assessment',
        body:  'Saudi MOH may require Prometric nursing assessment. Your recruitment agency will advise if this is required for the specific KFMC opening. Register at prometricmcq.com if needed. The exam is conducted at Prometric centers in the Philippines.'
      },
      {
        title: 'PDOS at OWWA and Get eOEC',
        body:  'Attend the Pre-Departure Orientation Seminar (PDOS) at any OWWA office — it is FREE and mandatory. Afterward, get your eOEC (Overseas Employment Certificate) at ofw.gov.ph. The eOEC exempts you from travel tax and terminal fee at NAIA.'
      },
      {
        title: 'Departure and Arrival in Riyadh',
        body:  'KFMC or your agency arranges airport pickup in Riyadh. You will be processed at KFMC\'s HR office upon arrival: iqama (residency permit) application, biometrics, hospital orientation. You move into KFMC compound accommodation within 1–3 days of arrival.'
      }
    ],

    tags: [
      'nurse', 'registered nurse', 'Saudi Arabia', 'Riyadh',
      'KFMC', 'King Fahad Medical City', 'MOH', 'OFW',
      'middle-east', 'tax-free', 'JCI', 'ICU', 'ER',
      'DataFlow', 'Prometric', 'medical', 'ofw'
    ],

    sourceUrl: 'https://kfmc.med.sa/en/careers',

    benefits: [
      'Salary: SAR 4,500–5,500/month (≈ ₱68,400–₱83,600) — TAX-FREE',
      'Free furnished single accommodation on KFMC hospital compound (Riyadh)',
      'Free transportation: hospital bus to/from accommodation and shopping areas',
      'Free meals or food allowance at hospital cafeteria',
      'Annual round-trip airfare to Philippines (economy class)',
      'Annual leave: 30 calendar days with full pay',
      'KFMC health insurance coverage (full medical at KFMC)',
      'End-of-service gratuity: 1 month salary per year of service (Saudi Labor Law)',
      'Continuing nursing education and training within KFMC',
      'OWWA coverage (₱100,000 disability/death benefit)',
      'PhilHealth voluntary contribution maintained',
      'Repatriation at employer\'s expense upon contract completion or no-fault termination'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     2. HEAVY EQUIPMENT OPERATOR — DUBAI, UAE
        Source: DMW job orders / verified construction agencies
        Deployment: Accredited UAE construction recruiters
     ══════════════════════════════════════════════════════════ */
  {
    id:          'heavy-equipment-op-dubai-2026',
    sector:      'ofw',
    category:    'middle-east',
    tier:        2,
    status:      'open',

    title:       'Heavy Equipment Operator (Excavator / Bulldozer)',
    agency:      'Al Habtoor Group Construction — Dubai, UAE',
    location:    'Dubai, United Arab Emirates',
    region:      'middle-east',

    salary:      46800,
    salaryMin:   46800,
    salaryMax:   62400,
    salaryText:  'AED 3,000–4,000/month (≈ ₱46,800–₱62,400 tax-free)',

    published:   '2026-04-10',
    deadline:    '2026-06-30',

    description: [
      'Al Habtoor Group is one of the UAE\'s largest and most ',
      'diversified conglomerates with major operations in ',
      'construction, real estate, hospitality, and automotive. ',
      'Al Habtoor Engineering Enterprises (AHE) is the ',
      'construction arm executing large-scale civil engineering ',
      'and building projects across Dubai and Abu Dhabi. ',
      'Heavy Equipment Operators are needed for ongoing ',
      'infrastructure projects including Expo City Dubai ',
      'development, Dubai Metro expansion, and waterfront ',
      'construction projects. Filipino heavy equipment operators ',
      'with TESDA NC II certification and documented operating ',
      'hours are highly preferred. The UAE does not impose ',
      'personal income tax — your full salary is take-home pay. ',
      'Accommodation and transportation are provided by the employer.'
    ].join(''),

    requirements: [
      'At least 3 years of documented heavy equipment operating experience (excavator, bulldozer, backhoe, crane, or equivalent)',
      'TESDA National Certificate II (NC II) in Heavy Equipment Operation — or equivalent international certification',
      'Valid Philippine driver\'s license (professional, at minimum) — UAE license conversion possible upon arrival',
      'UAE or international heavy equipment operator license preferred',
      'Experience in civil construction, earthmoving, or major infrastructure projects',
      'Physically fit for outdoor construction site work in hot climate (Dubai temperatures reach 45°C in summer)',
      'Must have completed safety training (OSHA or equivalent preferred)',
      'Willing to work on construction sites under shift schedule',
      'Willing to sign 2-year contract',
      'Age: 25–45 years old preferred',
      'No serious medical conditions affecting ability to operate heavy machinery'
    ],

    documents: [
      'Updated CV/resume with equipment operating hours log',
      'TESDA NC II Certificate in Heavy Equipment Operation (Apostilled by DFA)',
      'Certificate of Employment from previous construction companies (with description of equipment operated)',
      'Valid Philippine Passport (minimum 18 months validity)',
      'NBI Clearance — Apostilled by DFA (within 6 months)',
      'Philippine Driver\'s License (professional)',
      'International Driver\'s License (if available)',
      'Medical clearance from GAMCA-accredited clinic (for UAE)',
      'OWWA Membership receipt',
      'OEC / eOEC from DMW',
      'PDOS Certificate from OWWA',
      'TESDA NC II Certificate (Apostilled)',
      '2x2 and passport-size photos (6 pieces each)',
      'Safety training certificates (if any — OSHA 10/30, NEBOSH, etc.)'
    ],

    howToApply: [
      {
        title: 'Find a DMW-Accredited UAE Construction Agency',
        body:  'Heavy equipment operator positions for UAE are recruited through DMW-accredited agencies specializing in skilled workers. Check dmwph.com for the list of agencies with valid UAE accreditation and job orders for construction workers. Avoid agencies without a DMW license — UAE construction is a common sector for illegal recruitment scams.'
      },
      {
        title: 'Prepare Your TESDA Certificate and DFA Apostille',
        body:  'Your TESDA NC II Certificate must be Apostilled by the DFA. Schedule at dfa.gov.ph/apostille. This document proves your qualification to UAE employers. If you don\'t have TESDA NC II yet, enroll at a TESDA accredited center (tesda.gov.ph) before applying — training takes 2–4 months.'
      },
      {
        title: 'Skills Assessment / Trade Test',
        body:  'UAE employers typically require a practical skills assessment or trade test to verify actual equipment operating ability. This is either conducted in the Philippines at a TESDA assessment center or at the jobsite upon arrival. Be prepared to demonstrate excavator/bulldozer operation in a controlled setting.'
      },
      {
        title: 'GAMCA Medical Examination',
        body:  'The UAE requires GAMCA (Gulf Approved Medical Centers Association) medical clearance. This is done at designated GAMCA clinics in Metro Manila, Cebu, and other major cities. The exam tests for communicable diseases (TB, HIV, hepatitis), physical fitness, and drug use.'
      },
      {
        title: 'PDOS and eOEC Processing',
        body:  'Attend the PDOS (Pre-Departure Orientation Seminar) at OWWA. It is free, mandatory, and covers your rights in the UAE, emergency contacts, and remittance options. Get your eOEC at ofw.gov.ph afterward.'
      },
      {
        title: 'Departure and UAE Arrival',
        body:  'The employer or agency arranges airport transfer in Dubai. Upon arrival you go through UAE immigration with your employment visa. Your employer submits your iqama (UAE residency permit / Emirates ID) application. You will be in labor accommodation provided by the company during project assignment.'
      }
    ],

    tags: [
      'heavy equipment operator', 'excavator', 'bulldozer',
      'Dubai', 'UAE', 'United Arab Emirates', 'OFW',
      'middle-east', 'construction', 'TESDA NC II',
      'skilled worker', 'tax-free', 'Al Habtoor', 'ofw'
    ],

    sourceUrl: 'https://www.alhabtoor.com/careers',

    benefits: [
      'Salary: AED 3,000–4,000/month (≈ ₱46,800–₱62,400) — TAX-FREE',
      'Free accommodation in company labor camp (shared room with Filipino workers)',
      'Free transportation: company bus to/from worksite',
      'Free meals at company canteen (or food allowance)',
      'Annual round-trip airfare to Philippines',
      'Annual leave: 30 calendar days with full pay',
      'UAE employer-provided health insurance (mandatory under UAE law)',
      'End-of-service gratuity: 21 days pay per year for first 5 years (UAE Labor Law)',
      'UAE Workers Compensation Insurance (work-related injury)',
      'OWWA coverage from Philippines',
      'Overtime pay for hours beyond 8 hours/day and Friday work',
      'Repatriation at employer\'s expense upon contract completion'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     3. CARE WORKER (KAIGOSHI) — TOKYO, JAPAN
        Source: JICWELS / Japan EPA / SSW Program
        Deployment: DOLE-approved Japan deployment programs
     ══════════════════════════════════════════════════════════ */
  {
    id:          'careworker-tokyo-japan-2026',
    sector:      'ofw',
    category:    'asia-pacific',
    tier:        1,
    status:      'open',

    title:       'Care Worker (Kaigoshi / 介護士)',
    agency:      'Kowakare Care Home Network — Tokyo Metropolitan Area, Japan',
    location:    'Tokyo, Japan',
    region:      'asia-pacific',

    salary:      72000,
    salaryMin:   72000,
    salaryMax:   100000,
    salaryText:  '¥180,000–¥250,000/month (≈ ₱72,000–₱100,000)',

    published:   '2026-04-15',
    deadline:    '2026-07-15',

    description: [
      'Japan\'s rapidly aging population has created an urgent ',
      'and sustained demand for care workers (Kaigoshi). ',
      'The Kowakare Care Home Network operates 45 elderly care ',
      'facilities across the Tokyo Metropolitan Area (Tokyo, ',
      'Kanagawa, Saitama, Chiba). Filipino care workers are ',
      'recruited under the Specified Skilled Worker (SSW) ',
      'visa (Tokutei Ginou No. 2 Gou for Care) — a 5-year ',
      'renewable visa that allows indefinite renewal and ',
      'eventual permanent residency, unlike TITP. Care workers ',
      'assist elderly residents with Activities of Daily Living ',
      '(ADL): bathing, dressing, grooming, meals, mobility, ',
      'and recreational activities. Japanese language proficiency ',
      '(JLPT N4 minimum) is required. This is one of the best ',
      'long-term OFW pathways — SSW care workers can bring ',
      'family members to Japan under the SSW No. 2 visa category ',
      'available from 2027 onwards for those with strong ',
      'Japanese proficiency (JLPT N3 or higher).'
    ].join(''),

    requirements: [
      'Japanese Language Proficiency Test (JLPT) N4 or higher — N3 preferred (at time of deployment)',
      'JICA Care Worker Skills Evaluation Exam (Tokutei Ginou) OR completion of TITP care worker training',
      'High school graduate or higher (college graduate strongly preferred)',
      'Age: 22–40 years old preferred (Japanese elderly care facilities prefer younger Filipino workers)',
      'Basic knowledge of elderly care principles (can be learned through TESDA courses)',
      'Physically fit and patient in disposition — care work requires physical stamina and emotional resilience',
      'Clean criminal record',
      'Willingness to learn Japanese language and culture',
      'Must be willing to work in Tokyo (cold winters, hot summers)',
      'Willing to sign initial 1-year contract (renewable up to 5 years under SSW visa)',
      'Commitment to learning Japanese language to JLPT N3 level for long-term career path'
    ],

    documents: [
      'Updated CV (Japanese format: rirekisho 履歴書 — template available from agency)',
      'JLPT Certificate (N4 or higher) from Japan Educational Exchanges and Services',
      'Tokutei Ginou (SSW) Skills Evaluation Exam certificate for Care Work',
      'Certified true copy of Diploma and Transcript of Records (Apostilled by DFA)',
      'Valid Philippine Passport (minimum 18 months validity)',
      'NBI Clearance — Apostilled by DFA (within 6 months)',
      'Birth Certificate (PSA-authenticated, Apostilled by DFA)',
      'OWWA Membership receipt',
      'OEC / eOEC from DMW',
      'PDOS Certificate from OWWA',
      'Medical clearance (standard — not GAMCA, as Japan uses its own medical requirements)',
      'JICA or authorized agency enrollment certificate',
      'Proof of JLPT exam registration if exam date is upcoming'
    ],

    howToApply: [
      {
        title: 'Start with Japanese Language Training',
        body:  'The most critical prerequisite is JLPT N4. Enroll in a Japanese language class immediately if you haven\'t already. TESDA offers free Japanese language courses (nihongo) at TESDA centers. Private language schools in Metro Manila offer N4-focused courses for ₱15,000–₱30,000 over 6 months. JLPT exams in the Philippines are held in July and December — register at jees.or.jp/jlpt.'
      },
      {
        title: 'Take the Tokutei Ginou (SSW) Care Worker Exam',
        body:  'The Specified Skilled Worker Skills Evaluation Exam for Care Work is conducted in the Philippines twice a year by JICWELS (Japan International Corporation of Welfare Services). Register at jicwels.or.jp. The exam covers Japanese care work knowledge and Japanese language. Those who pass JLPT N4 AND the skills exam qualify for the SSW visa.'
      },
      {
        title: 'Contact DOLE-Approved Japan Deployment Programs',
        body:  'Japan deployment through SSW is managed through approved programs. Contact DOLE-OWWA Japan Desk at OWWA Central Office, Ortigas, Pasig, or POLO (Philippine Overseas Labor Office) Japan for the list of accredited agencies sending care workers to Japan. Fees are regulated — total should not exceed one month\'s salary.'
      },
      {
        title: 'Prepare DFA Apostilled Documents',
        body:  'Japan requires DFA Apostille on your TOR, Diploma, and NBI Clearance. Schedule at dfa.gov.ph/apostille. The Japanese employer and embassy may also require a Certificate of Eligibility (COE) application which the Japanese employer files on your behalf — this takes 1–3 months from Japan Immigration.'
      },
      {
        title: 'Japanese Embassy Visa Application',
        body:  'Once the Certificate of Eligibility (COE) arrives from Japan, apply for your Specified Skilled Worker Visa at the Japanese Embassy in Manila (Roxas Boulevard, Pasay). Bring your COE, passport, and all documents. Processing: 5–10 business days.'
      },
      {
        title: 'PDOS and Departure',
        body:  'Attend the Japan-specific PDOS at OWWA which covers Japan labor laws, care work expectations, Japanese customs, remittance, and emergency contacts at POLO Japan. Get your eOEC. The employer arranges airport pickup in Tokyo (Narita or Haneda).'
      }
    ],

    tags: [
      'care worker', 'kaigoshi', 'Japan', 'Tokyo',
      'SSW', 'Tokutei Ginou', 'JLPT N4', 'elderly care',
      'Asia Pacific', 'OFW', 'permanent residency pathway',
      'nihongo', 'JICWELS', 'ofw', 'long-term'
    ],

    sourceUrl: 'https://jicwels.or.jp',

    benefits: [
      'Salary: ¥180,000–¥250,000/month (≈ ₱72,000–₱100,000)',
      'Japanese social insurance (shakai hoken): health insurance, pension, employment insurance',
      'Free or subsidized accommodation (monthly rent ¥20,000–₱50,000 deducted from salary — still excellent net)',
      'Transportation allowance to/from workplace',
      'Annual leave: minimum 10 days/year (increases with years of service under Japanese Labor Law)',
      'Paid public holidays (Japan has 16 national holidays per year)',
      'Year-end bonus (boーナス): typically 1–2 months salary',
      'Japanese language training support provided by employer (required under SSW visa)',
      'SSW visa renewable indefinitely (path to permanent residency after 10 years)',
      'After JLPT N3 + SSW No.2 reclassification: ability to bring spouse and children to Japan',
      'Repatriation airfare at contract end',
      'OWWA coverage from Philippines'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     4. REGISTERED NURSE — PROVIDENCE HEALTH CARE, CANADA
        Source: phsa.ca/careers | HealthMatchBC
        Deployment: CGFNS / NNAS / CPRN pathway
     ══════════════════════════════════════════════════════════ */
  {
    id:          'rn-providence-canada-2026',
    sector:      'ofw',
    category:    'europe-americas',
    tier:        1,
    status:      'open',

    title:       'Registered Nurse (RN) — Health Care Worker Stream',
    agency:      'Providence Health Care — Vancouver, British Columbia, Canada',
    location:    'Vancouver, British Columbia, Canada',
    region:      'europe-americas',

    salary:      168000,
    salaryMin:   154560,
    salaryMax:   181440,
    salaryText:  'CAD 3,680–4,320/month (≈ ₱154,560–₱181,440)',

    published:   '2026-04-20',
    deadline:    '2026-08-20',

    description: [
      'Providence Health Care is a Catholic healthcare organization ',
      'operating 17 hospitals and specialized healthcare facilities ',
      'in British Columbia, Canada, including St. Paul\'s Hospital ',
      '(Vancouver), Mount Saint Joseph Hospital, and Holy Family ',
      'Hospital. Providence is part of the Provincial Health ',
      'Services Authority (PHSA) network and is actively recruiting ',
      'Registered Nurses from the Philippines through the Canadian ',
      'Express Entry — Health Care Worker priority stream and the ',
      'BC PNP (Provincial Nominee Program) for healthcare workers. ',
      'Filipino nurses at Providence work in acute care, ICU, ',
      'medical-surgical, emergency, and community health settings. ',
      'The position includes a clear pathway to Canadian Permanent ',
      'Residency (PR) under the Express Entry Health Care Worker ',
      'stream (additional 50–500 CRS points for healthcare workers). ',
      'NCLEX-RN is required for Canadian nursing registration. ',
      'The CPRN (College of Registered Nurses of BC) registration ',
      'process takes 3–6 months and is initiated before departure.'
    ].join(''),

    requirements: [
      'Bachelor of Science in Nursing (BSN) from a CHED-recognized Philippine institution',
      'Valid PRC Nursing license (current)',
      'NCLEX-RN passed — registration through CPRN (College of Registered Nurses of British Columbia)',
      'NNAS (National Nursing Assessment Service) credential evaluation completed OR equivalent provincial body assessment',
      'English language proficiency: IELTS Academic (minimum: L 7.0 / R 6.5 / W 7.0 / S 7.0) or CELPIP General (7 in all bands)',
      'Minimum 2 years post-licensure clinical nursing experience (ICU, ER, or medical-surgical preferred)',
      'Adaptable to Canadian healthcare system (Evidence-Based Practice, British Columbia Patient Safety Standards)',
      'Willingness to relocate to Vancouver, BC (Canada\'s most expensive city — employer provides relocation support)',
      'Willingness to apply for Canadian Permanent Residency through Express Entry or BC PNP',
      'No criminal record (Canadian police clearance / RCMP check required before PR)',
      'Valid passport (minimum 3 years validity recommended)'
    ],

    documents: [
      'Updated CV in Canadian format (no photo, no age, no civil status — Canadian employment standards)',
      'Certified true copy of PRC Nursing ID and Board Certificate',
      'Certified true copy of BSN Transcript of Records and Diploma',
      'NNAS credential assessment report (primary source verification equivalent)',
      'NCLEX-RN CPNRE result / CPRN registration in progress documentation',
      'IELTS Academic or CELPIP score report (within 2 years)',
      'NBI Clearance — Apostilled by DFA',
      'Valid Philippine Passport',
      'Certificate of Employment from current/previous hospital(s) — English, on hospital letterhead',
      'Reference letters from 2 supervisory nurses or nurse managers',
      'OWWA Membership receipt',
      'OEC/eOEC from DMW',
      'PDOS Certificate from OWWA'
    ],

    howToApply: [
      {
        title: 'Pass NCLEX-RN and Begin CPRN Registration',
        body:  'The NCLEX-RN (National Council Licensure Examination) is required for Canadian nursing registration. Register through the CPRN (College of Registered Nurses of British Columbia) at crnbc.ca. Apply for NNAS credential evaluation at nnas.ca first — NNAS verifies your Philippine nursing credentials and takes 3–5 months. Take the NCLEX-RN at a Pearson VUE center in the Philippines (Makati or Mandaluyong).'
      },
      {
        title: 'Complete IELTS or CELPIP English Test',
        body:  'Book IELTS Academic at ielts.org or CELPIP at celpiptest.ca. The Canadian Express Entry for nurses requires minimum IELTS scores of L 7.0 / R 6.5 / W 7.0 / S 7.0 (equivalent to CLB 9). Enroll in IELTS preparation classes for 3–6 months if you haven\'t taken it before. Test centers are in Manila, Cebu, Davao, and other cities.'
      },
      {
        title: 'Apply to Providence Health Care Careers',
        body:  'Visit phsa.ca/careers or careers.providencehealthcare.org and apply for RN positions specifying your interest in the international recruitment pathway. You may also apply through HealthMatchBC (healthmatchbc.org) — a free BC government recruitment service connecting international nurses with BC employers. No agency fee through HealthMatchBC.'
      },
      {
        title: 'Express Entry CRS Profile — Health Care Worker Points',
        body:  'Create an Express Entry profile at canada.ca/en/immigration-refugees-citizenship. Under the Health Care Worker category (announced 2023), nurses with a Canadian job offer receive 50 additional CRS points. With your educational credentials, language scores, and nursing experience, aim for CRS 400–450. BC PNP Skilled Worker stream for healthcare workers offers an additional provincial nomination (adds 600 CRS points).'
      },
      {
        title: 'Job Offer and Work Permit',
        body:  'Providence issues a formal job offer which is used to apply for a Temporary Foreign Worker (TFW) permit or is included in the Express Entry ITA (Invitation to Apply). IRCC processing for TFW: 3–6 months. Express Entry PR: 6 months from ITA. Most Filipino nurses at Providence eventually convert their work permit to PR status.'
      },
      {
        title: 'PDOS and Departure to Vancouver',
        body:  'The Canada-specific PDOS at OWWA covers Canadian labor law, BC Workers Compensation Board, healthcare employment standards, and POLO Vancouver contacts. Providence\'s HR team coordinates orientation. Vancouver airport pickup is arranged by Providence HR. Relocation allowance: CAD 2,000–5,000 (employer-provided).'
      }
    ],

    tags: [
      'registered nurse', 'RN', 'Canada', 'Vancouver',
      'BC', 'British Columbia', 'Providence Health Care',
      'NCLEX-RN', 'CPRN', 'Express Entry', 'PR pathway',
      'IELTS', 'NNAS', 'OFW', 'europe-americas',
      'permanent residency', 'healthcare', 'ofw'
    ],

    sourceUrl: 'https://phsa.ca/careers',

    benefits: [
      'Salary: CAD 3,680–4,320/month (≈ ₱154,560–₱181,440) — Note: subject to Canadian income tax (15–26% federal + BC provincial)',
      'After-tax take-home: approximately CAD 2,800–3,400/month (≈ ₱117,600–₱142,800)',
      'BC MSP (Medical Services Plan) — universal healthcare coverage for you and family',
      'Employer-contributed pension plan (BC Healthcare workers pension)',
      'HCAP (Healthcare Assistant and Continuing Education Fund) — training budget',
      'Relocation allowance: CAD 2,000–5,000 upon acceptance',
      'BC Nurses Union (BCNU) membership — strong worker protections, grievance process',
      'Annual vacation: 4 weeks (3 weeks starting, increases with years of service)',
      'Sick leave: up to 18 days per year',
      'Stat holidays: 11 BC statutory holidays with full pay',
      'Overtime: 1.5× pay after 8 hours/day or 40 hours/week',
      'Life insurance and long-term disability coverage',
      'Clear pathway to Canadian Permanent Residency (PR)',
      'PR leads to Canadian citizenship eligibility after 3 years of physical presence',
      'OWWA coverage from Philippines side'
    ]
  }

];