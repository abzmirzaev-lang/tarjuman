-- ============================================================
-- TARJUMAN — Saudi Universities Seed
-- Run this in Supabase SQL Editor
-- ============================================================

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Короля Абдулазиза','King Abdulaziz universiteti','King Abdulaziz University','SA','Джидда','https://kau.edu.sa',
'Крупнейший университет Саудовской Аравии в Джидде. Основан в 1967 году. 33 факультета, 177 программ. Предлагает уникальные программы по морским наукам, метеорологии и астрономии. Принимает студентов со всего мира.',
'Jiddadagi eng yirik Saudiya Arabistoni universiteti. 1967 yilda asos solingan. 33 fakultet, 177 ta dastur. Dengiz fanlari, meteorologiya va astronomiya bo''yicha noyob dasturlarni taklif etadi.',
'The largest university in Saudi Arabia in Jeddah. Founded in 1967. 33 faculties, 177 programs. Offers unique programs in marine sciences, meteorology and astronomy.',
ARRAY['Engineering','Medicine','Business','Sciences','Law','Computer Science','Pharmacy','Dentistry','Architecture','Marine Sciences','Tourism','Media'],
true, 1
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'King Abdulaziz University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Короля Сауда','King Saud universiteti','King Saud University','SA','Эр-Рияд','https://ksu.edu.sa',
'Первый университет Саудовской Аравии, основан в 1957 году в Эр-Рияде. 23 факультета, более 450 академических программ. Входит в топ-200 университетов мира по версии QS Rankings.',
'Saudiya Arabistonining birinchi universiteti, 1957 yilda Ar-Riyodda tashkil etilgan. 23 ta fakultet, 450 dan ortiq akademik dastur. QS Rankings bo''yicha dunyoning top-200 universiteti.',
'The first university in Saudi Arabia, founded in 1957 in Riyadh. 23 colleges, over 450 academic programs. Ranked in the top 200 universities worldwide by QS Rankings.',
ARRAY['Medicine','Engineering','Business','Sciences','Computer Science','Pharmacy','Dentistry','Nursing','Architecture','Law','Arts & Sciences','Education','Agriculture'],
true, 2
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'King Saud University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет нефти и минералов им. Короля Фахда','KFUPM - King Fahd Neft va Minerallar Universiteti','King Fahd University of Petroleum and Minerals','SA','Дахран','https://kfupm.edu.sa',
'Ведущий технический университет Ближнего Востока, #1 в регионе MENA (Times Higher Education 2025). Основан в 1963 году в Дахране. Специализируется на инженерии и нефтяной промышленности.',
'Yaqin Sharqning etakchi texnik universiteti, MENA mintaqasida №1. 1963 yilda Daxranda tashkil etilgan. Muhandislik va neft sanoatiga ixtisoslashgan.',
'Leading technical university of the Middle East, #1 in the MENA region. Founded in 1963 in Dhahran. Specializes in engineering and the petroleum industry.',
ARRAY['Engineering','Computer Science','Sciences','Business','Architecture','Petroleum Engineering'],
true, 3
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'King Fahd University of Petroleum and Minerals');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Исламский университет имама Мухаммада ибн Сауда','Imom Muhammad ibn Saud Islom Universiteti','Imam Muhammad ibn Saud Islamic University','SA','Эр-Рияд','https://imamu.edu.sa',
'Один из крупнейших исламских университетов мира в Эр-Рияде. Основан в 1953 году. 14 факультетов, 70 институтов в Саудовской Аравии и 5 институтов за рубежом — в Индонезии и Джибути.',
'Ar-Riyoddagi dunyoning eng yirik islomiy universitetlaridan biri. 1953 yilda tashkil etilgan. 14 ta fakultet, Saudiya Arabistonida 70 ta va xorijda 5 ta institut.',
'One of the largest Islamic universities in the world in Riyadh. Founded in 1953. 14 colleges, 70 institutes in Saudi Arabia and 5 institutes abroad — in Indonesia and Djibouti.',
ARRAY['Islamic Studies','Engineering','Medicine','Computer Science','Sciences','Business','Social Sciences','Arabic Language','Media','Law','Education','Shariah'],
true, 4
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Imam Muhammad ibn Saud Islamic University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Исламский университет Медины','Madinah Islomiy Universiteti','Islamic University of Madinah','SA','Медина','https://iu.edu.sa',
'Международный исламский университет в Медине, основан в 1961 году. Принимает студентов из 170+ стран. Предоставляет полную стипендию иностранным студентам — включая жильё и питание.',
'Madinadagi xalqaro islomiy universitet, 1961 yilda tashkil etilgan. 170+ davlatdan talabalar qabul qiladi. Xorijiy talabalarga to''liq stipendiya beradi.',
'International Islamic University in Madinah, founded in 1961. Accepts students from 170+ countries. Provides full scholarships to foreign students including accommodation and meals.',
ARRAY['Islamic Studies','Shariah','Quran','Dawah','Arabic Language','Sciences','Law'],
true, 5
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Islamic University of Madinah');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Умм аль-Кура','Umm al-Qura Universiteti','Umm Al-Qura University','SA','Мекка','https://uqu.edu.sa',
'Старейший университет Саудовской Аравии, расположен в Мекке. Основан в 1949 году. 34 факультета, 119 кафедр, 402 образовательные программы. Специализируется на исламских науках.',
'Saudiya Arabistonining eng qadimgi universiteti, Makkada joylashgan. 1949 yilda tashkil etilgan. 34 ta fakultet, 119 ta kafedra, 402 ta ta''lim dasturi.',
'The oldest university in Saudi Arabia, located in Mecca. Founded in 1949. 34 colleges, 119 departments, 402 educational programs. Specializes in Islamic sciences.',
ARRAY['Islamic Studies','Arabic Language','Business','Education','Engineering','Medicine','Computer Science','Pharmacy','Social Sciences','Nursing','Dentistry'],
true, 6
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Umm Al-Qura University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Короля Халида','King Khalid Universiteti','King Khalid University','SA','Абха','https://kku.edu.sa',
'Государственный университет в Абхе, регион Асир. Основан в 1998 году. 26 аккредитованных факультетов, расположенных на 27 кампусах. Более 60 000 студентов.',
'Asir mintaqasidagi Abhada joylashgan davlat universiteti. 1998 yilda tashkil etilgan. 27 ta kampusda 26 ta akkreditatsiyalangan fakultet. 60 000 dan ortiq talaba.',
'State university in Abha, Asir region. Founded in 1998. 26 accredited colleges across 27 campuses. Over 60,000 students.',
ARRAY['Shariah','Arts & Sciences','Languages','Computer Science','Education','Business','Engineering','Medicine','Dentistry','Pharmacy','Sciences','Nursing','Law','Tourism'],
true, 7
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'King Khalid University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Короля Фейсала','King Faysal Universiteti','King Faisal University','SA','Аль-Хуфуф','https://kfu.edu.sa',
'Государственный университет в Аль-Хуфуфе (провинция Аль-Ахса). Основан в 1975 году. 15 факультетов, 125 образовательных программ. Занимает площадь 4 млн кв. м.',
'Al-Ahsa viloyatidagi Al-Xufufda joylashgan davlat universiteti. 1975 yilda tashkil etilgan. 15 ta fakultet, 125 ta ta''lim dasturi. 4 million kv.m maydon.',
'State university in Al-Hofuf, Al-Ahsa Province. Founded in 1975. 15 colleges, 125 educational programs. Campus covers 4 million sq.m.',
ARRAY['Agriculture','Veterinary Medicine','Education','Business','Medicine','Sciences','Computer Science','Engineering','Pharmacy','Applied Medical Sciences','Arts & Sciences','Law','Dentistry'],
true, 8
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'King Faisal University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Таиба','Taybah Universiteti','Taibah University','SA','Медина','https://taibahu.edu.sa',
'Государственный университет в Медине. Основан в 2003 году. 28 факультетов — единственный университет в Медине с полноценным медицинским факультетом. Принимает студентов из разных стран.',
'Madinadagi davlat universiteti. 2003 yilda tashkil etilgan. 28 ta fakultet — Madinadagi to''liq tibbiyot fakultetiga ega yagona universitet.',
'State university in Madinah. Founded in 2003. 28 colleges — the only university in Madinah with a full medical college. Accepts international students.',
ARRAY['Medicine','Dentistry','Pharmacy','Engineering','Sciences','Shariah','Education','Arts & Sciences','Business','Applied Medical Sciences'],
true, 9
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Taibah University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Таиф','Tayif Universiteti','Taif University','SA','Таиф','https://tu.edu.sa',
'Государственный университет в Таифе. Основан в 2004 году. 17 факультетов, 56 885 студентов. Кампус расположен в живописном горном регионе Аль-Хавия.',
'Tayifdagi davlat universiteti. 2004 yilda tashkil etilgan. 17 ta fakultet, 56 885 talaba. Kampus Al-Xaviya tog''li mintaqasida joylashgan.',
'State university in Taif. Founded in 2004. 17 colleges, 56,885 students. Campus is located in the scenic Al-Hawiyah mountain region.',
ARRAY['Medicine','Dentistry','Pharmacy','Applied Medical Sciences','Nursing','Education','Arts & Sciences','Business','Shariah','Engineering','Sciences','Computer Science'],
true, 10
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Taif University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Касим','Qassim Universiteti','Qassim University','SA','Бурайда','https://qu.edu.sa',
'Государственный университет в Бурайде. Основан в 2004 году. Более 38 факультетов, 120+ программ бакалавриата, 70+ программ магистратуры и 30+ программ PhD. Один из самых больших по числу факультетов.',
'Burayda shahridagi davlat universiteti. 2004 yilda tashkil etilgan. 38 dan ortiq fakultet, 120+ bakalavr, 70+ magistratura va 30+ doktorantura dasturlari.',
'State university in Buraidah. Founded in 2004. Over 38 colleges, 120+ bachelor degrees, 70+ master degrees and 30+ PhD programs.',
ARRAY['Shariah','Arabic Language','Agriculture','Business','Sciences','Medicine','Engineering','Computer Science','Pharmacy','Dentistry','Applied Medical Sciences','Education'],
true, 11
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Qassim University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Табук','Tabuk Universiteti','University of Tabuk','SA','Табук','https://ut.edu.sa',
'Государственный университет на севере Саудовской Аравии. Основан в 2006 году. 18 факультетов. Расположен вблизи исторического города Хегра (Мадаин-Салих, объект ЮНЕСКО).',
'Saudiya Arabistonining shimolida joylashgan davlat universiteti. 2006 yilda tashkil etilgan. 18 ta fakultet. UNESCO ob''ekti Xijra shahri yaqinida joylashgan.',
'State university in northern Saudi Arabia. Founded in 2006. 18 colleges. Located near the historic city of Hegra (Mada''in Salih, UNESCO site).',
ARRAY['Medicine','Engineering','Sciences','Computer Science','Education','Shariah','Business','Pharmacy','Applied Medical Sciences','Tourism','Designs'],
true, 12
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'University of Tabuk');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Хаиль','Hail Universiteti','University of Ha''il','SA','Хаиль','https://uoh.edu.sa',
'Государственный университет в Хаиле, северная часть Саудовской Аравии. Основан в 2005 году. 14 факультетов, 51 программа бакалавриата, 32 программы магистратуры. 34 684 студента.',
'Saudiya Arabistonining shimolida, Hail shahrida joylashgan davlat universiteti. 2005 yilda tashkil etilgan. 14 ta fakultet, 51 ta bakalavr va 32 ta magistratura dasturi.',
'State university in Ha''il, northern Saudi Arabia. Founded in 2005. 14 colleges, 51 undergraduate and 32 postgraduate programs. 34,684 students.',
ARRAY['Medicine','Engineering','Sciences','Computer Science','Business','Education','Applied Medical Sciences','Dentistry','Nursing'],
true, 13
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'University of Ha''il');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Джизан','Jazan Universiteti','Jazan University','SA','Джизан','https://jazanu.edu.sa',
'Государственный университет на юго-западе Саудовской Аравии, у берегов Красного моря. Основан в 2006 году. 23 факультета, более 35 000 студентов. Известен медицинской и инженерной школами.',
'Saudiya Arabistonining janubi-g''arbida, Qizil dengiz qirg''og''ida joylashgan. 2006 yilda tashkil etilgan. 23 ta fakultet, 35 000 dan ortiq talaba.',
'State university in southwestern Saudi Arabia, on the Red Sea coast. Founded in 2006. 23 colleges, over 35,000 students. Known for medical and engineering schools.',
ARRAY['Medicine','Dentistry','Engineering','Computer Science','Sciences','Business','Education','Applied Medical Sciences','Pharmacy','Nursing'],
true, 14
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Jazan University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Наджран','Najron Universiteti','Najran University','SA','Наджран','https://nu.edu.sa',
'Государственный университет на юге Саудовской Аравии, вблизи границы с Йеменом. Основан в 2006 году. 14 факультетов, 70 специальностей. Крупный центр образования на юге королевства.',
'Saudiya Arabistonining janubida, Yaman chegarasi yaqinida joylashgan. 2006 yilda tashkil etilgan. 14 ta fakultet, 70 ta mutaxassislik.',
'State university in southern Saudi Arabia, near the border with Yemen. Founded in 2006. 14 colleges, 70 specializations.',
ARRAY['Medicine','Engineering','Sciences','Computer Science','Business','Education','Arts & Sciences','Applied Medical Sciences','Shariah'],
true, 15
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Najran University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Аль-Баха','Al-Baha Universiteti','Al-Baha University','SA','Аль-Баха','https://bu.edu.sa',
'Государственный университет в живописном горном регионе Аль-Баха на юго-западе королевства. Основан в 2006 году. 16 факультетов и 5 научно-исследовательских центров.',
'Qirollikning janubi-g''arbidagi go''zal tog''li Al-Baha mintaqasidagi davlat universiteti. 2006 yilda tashkil etilgan. 16 ta fakultet va 5 ta ilmiy-tadqiqot markazi.',
'State university in the scenic mountainous region of Al-Baha in the southwest of the kingdom. Founded in 2006. 16 colleges and 5 research centers.',
ARRAY['Sciences','Engineering','Business','Education','Medicine','Computer Science','Applied Medical Sciences','Arts & Sciences','Shariah'],
true, 16
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Al-Baha University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Шакра','Shaqra Universiteti','Shaqra University','SA','Шакра','https://su.edu.sa',
'Государственный университет в провинции Эр-Рияд. Основан в 2009 году. 24 факультета — один из крупнейших по числу факультетов в Саудовской Аравии. Входит в топ-10 университетов КСА.',
'Ar-Riyod viloyatidagi davlat universiteti. 2009 yilda tashkil etilgan. 24 ta fakultet — Saudiya Arabistonida fakultetlar soni bo''yicha eng yiriklari orasida.',
'State university in Riyadh Province. Founded in 2009. 24 colleges — one of the largest by number of colleges in Saudi Arabia.',
ARRAY['Sciences','Engineering','Business','Education','Applied Medical Sciences','Computer Science','Arts & Sciences','Shariah'],
true, 17
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Shaqra University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Джидды','Jidda Universiteti','University of Jeddah','SA','Джидда','https://uj.edu.sa',
'Молодой государственный университет в Джидде, основан в 2014 году. 16 факультетов. Современный кампус с передовой инфраструктурой. Активно развивает международное сотрудничество.',
'Jiddadagi yosh davlat universiteti, 2014 yilda tashkil etilgan. 16 ta fakultet. Zamonaviy kampus va ilg''or infratuzilma.',
'Young state university in Jeddah, founded in 2014. 16 colleges. Modern campus with advanced infrastructure. Actively developing international cooperation.',
ARRAY['Business','Education','Sciences','Arts & Sciences','Computer Science','Engineering','Applied Medical Sciences','Social Sciences','Sport Sciences'],
true, 18
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'University of Jeddah');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Северных Границ','Shimoliy Chegara Universiteti','Northern Border University','SA','Арар','https://nbu.edu.sa',
'Государственный университет в Araре, крайний север Саудовской Аравии. Основан в 2007 году. Обслуживает северные регионы королевства, включая районы Арар, Тарф и Рафха.',
'Saudiya Arabistonining shimolida, Arorda joylashgan davlat universiteti. 2007 yilda tashkil etilgan. Qirollikning shimoliy mintaqalariga xizmat ko''rsatadi.',
'State university in Arar, the far north of Saudi Arabia. Founded in 2007. Serves the northern regions of the kingdom including Arar, Turaif and Rafha.',
ARRAY['Sciences','Engineering','Business','Education','Applied Medical Sciences','Computer Science','Arts & Sciences'],
true, 19
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Northern Border University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет аль-Джауф','Al-Jawf Universiteti','Jouf University','SA','Аль-Джауф','https://ju.edu.sa',
'Государственный университет в регионе аль-Джауф на севере Саудовской Аравии. Основан в 2005 году. Динамично развивающийся университет с широкой программой специальностей.',
'Saudiya Arabistonining shimolida, Al-Jawf mintaqasidagi davlat universiteti. 2005 yilda tashkil etilgan. Keng mutaxassisliklar dasturiga ega.',
'State university in the Al-Jouf region in northern Saudi Arabia. Founded in 2005. A dynamically developing university with a wide range of specializations.',
ARRAY['Sciences','Engineering','Business','Education','Medicine','Computer Science','Applied Medical Sciences','Arts & Sciences','Shariah'],
true, 20
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Jouf University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет принца Саттама бин Абдулазиза','Shahzoda Sattam bin Abdulaziz Universiteti','Prince Sattam bin Abdulaziz University','SA','Аль-Хардж','https://psau.edu.sa',
'Государственный университет в Аль-Хардже, провинция Эр-Рияд. Основан в 2009 году. Специализируется на медицинских и инженерных специальностях. Около 25 000 студентов.',
'Ar-Riyod viloyatining Al-Xarj shahridagi davlat universiteti. 2009 yilda tashkil etilgan. Tibbiyot va muhandislik mutaxassisliklariga ixtisoslashgan.',
'State university in Al-Kharj, Riyadh Province. Founded in 2009. Specializes in medical and engineering programs. About 25,000 students.',
ARRAY['Medicine','Engineering','Sciences','Computer Science','Business','Education','Pharmacy','Applied Medical Sciences','Dentistry'],
true, 21
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Prince Sattam bin Abdulaziz University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет Маджмаа','Majmaa Universiteti','Majmaah University','SA','Маджмаа','https://mu.edu.sa',
'Государственный университет в Маджмаа, центральная часть Саудовской Аравии. Основан в 2009 году. Около 30 000 студентов. Имеет кампусы в нескольких городах провинции Эр-Рияд.',
'Saudiya Arabistonining markazida, Majmaah shahrida joylashgan davlat universiteti. 2009 yilda tashkil etilgan. 30 000 ga yaqin talaba.',
'State university in Majmaah, central Saudi Arabia. Founded in 2009. About 30,000 students. Has campuses in several cities of Riyadh Province.',
ARRAY['Medicine','Engineering','Sciences','Computer Science','Business','Education','Applied Medical Sciences','Dentistry','Nursing'],
true, 22
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'Majmaah University');

INSERT INTO universities (name_ru, name_uz, name_en, country, city, website_url, description_ru, description_uz, description_en, programs, is_active, rank)
SELECT 'Университет науки и технологий им. Короля Абдуллы','KAUST - King Abdulloh Fan va Texnologiyalar Universiteti','King Abdullah University of Science and Technology','SA','Тувал','https://kaust.edu.sa',
'Элитный исследовательский университет мирового уровня в Тувале, основан в 2009 году. Специализируется исключительно на аспирантуре. Входит в топ-100 лучших университетов мира. Передовые исследования в области энергетики, нанотехнологий и ИИ.',
'2009 yilda asos solingan Tuvalda joylashgan elita tadqiqot universiteti. Faqat magistratura va doktoranturaga ixtisoslashgan. Dunyoning top-100 universiteti orasida. Energetika, nanotexnologiya va AI sohasida ilg''or tadqiqotlar.',
'Elite world-class research university in Thuwal, founded in 2009. Specializes exclusively in graduate studies. Ranked in top 100 universities worldwide. Advanced research in energy, nanotechnology and AI.',
ARRAY['Engineering','Sciences','Computer Science','Biotechnology'],
true, 23
WHERE NOT EXISTS (SELECT 1 FROM universities WHERE name_en = 'King Abdullah University of Science and Technology');

