# 🛠️ Portfolio Development & Correction Checklist

এই চেকলিস্টটি মিটিং ট্রান্সক্রিপশন (`Correction/transcript.md`) এবং সিভি (`cv.md`) অনুযায়ী তৈরি করা হয়েছে। প্রতিটি টাস্কে প্রয়োজনীয় কনটেক্সট, টার্গেট ফাইল, পরিবর্তনের সুনির্দিষ্ট নিয়ম এবং যাচাইয়ের উপায় অন্তর্ভুক্ত আছে। যেকোনো নতুন সেশনে এজেন্ট এই ফাইলটি দেখে ধারাবাহিকভাবে কাজ সম্পন্ন করবে এবং টাস্ক শেষ হলে টিক (`- [x]`) মার্ক করবে।

---

## 📌 Phase 0: Hero Section Academic Identity & Badges Refactoring

- [x] **Task 0.1: Add Academic Affiliation Card & Clean up Hero Badges**
  - **Target Files:** `index.html` (লাইন ৯০–১১৫) ও `styles.css` (লাইন ৪৫০–৫২০)
  - **Context:** হোয়াটসঅ্যাপ মেসেজ ও মিটিংয়ের নির্দেশনা (00:25–00:31) অনুযায়ী নামের ওপরের ৩টি বিচ্ছিন্ন ব্যাজ বাদ দিয়ে নামের সাথে পূর্ণ একাডেমিক ডেজিগনেশন একটি মার্জিত বক্সে দেখাতে হবে।
  - **Applied Changes:**
    - ওপরের `.hero-badge-group` বাদ দিয়ে নামের নিচে `.hero-affiliation-box` যোগ করা হয়েছে।
    - **Affiliation Data:** `Lecturer`, `Department of Civil Engineering`, `United International University (UIU)`।
    - ব্লুপ্রিন্ট গ্লাস স্টাইল ও মোবাইল সেন্টারিং রেসপনসিভনেস যুক্ত করা হয়েছে।

---

## 📌 Phase 1: Research Focus & Interests Refactoring

- [x] **Task 1.1: Remove Research Pipeline Card (3 Boxes)**
  - **Target File:** `index.html` (প্রায় লাইন ১৯৯–২২১) ও `styles.css`
  - **Context:** `#about` সেকশনে থাকা `01 Crash & Geospatial Data`, `02 Statistical & Machine Learning Models`, `03 Research & Teaching` কার্ড ৩টি অতিরিক্ত এবং অন্যান্য সেকশনের সাথে ডুপ্লিকেট তথ্য তৈরি করছে।
  - **Action:**
    1. `index.html` থেকে `<div class="research-pipeline-card">...</div>` ব্লকটি সম্পূর্ণ মুছে ফেলতে হবে।
    2. `styles.css` থেকে অব্যবহৃত `.research-pipeline-card`, `.pipeline-grid`, `.pipeline-step`, `.step-number` সম্পর্কিত রুলগুলো ক্লিনআপ করতে হবে।

- [x] **Task 1.2: Add Dedicated "Research Focus & Expertise" 2-Column Academic List**
  - **Target File:** `index.html` (Hero সেকশন) ও `styles.css`
  - **Context:** এআই-স্টাইল চিপ বা ট্যাগ ক্লাউড বাদ দিয়ে ৬টি মূল রিসার্চ ক্ষেত্র পরিষ্কার ২-কলামের একাডেমিক লিস্ট হিসেবে লেফট অ্যাকসেন্ট বর্ডার সহ কার্ডে উপস্থাপন।
  - **Exact Content:**
    - `Multimodal Traffic Data Analytics`
    - `AI-Based Traffic Flow and Road Safety Analysis`
    - `Digital Twins for Transportation Infrastructure`
    - `Intelligent Transportation Systems (ITS)`
    - `Transportation Policy and Planning`
    - `Highway & Airport Pavement Engineering`
  - **Verification:** ডেস্কটপে ২-কলাম ও মোবাইলে ১-কলামে মার্জিত ডট মার্কার সহ সোবার একাডেমিক কার্ড হিসেবে রেন্ডার হচ্ছে।

---

## 📌 Phase 2: Teaching & Courses Section Cleanup

- [x] **Task 2.1: Remove Dummy Tags & Verbose Descriptions**
  - **Target File:** `index.html` ও `styles.css`
  - **Context:** অবাস্তব `CE LAB 300+`, `CE CORE 300+` ট্যাগ এবং বড় বড় ডেসক্রিপশন লিস্ট বাদ দিয়ে সেকশনটি কমপ্যাক্ট করা হয়েছে।

- [x] **Task 2.2: Add All 7 UIU Courses in a Compact Card Grid**
  - **Target File:** `index.html` ও `styles.css`
  - **Exact Courses Included (UIU):**
    1. **CE 2201** · Engineering Geology and Geomorphology *(Core Theory)*
    2. **CE 4171** · Irrigation and flood control *(Core Theory)*
    3. **CE 2104** · GIS and Remote Sensing Lab *(Lab / Sessional)*
    4. **CE 1202** · Practical Surveying *(Lab / Sessional)*
    5. **CE 2271** · Engineering Hydrology *(Core Theory)*
    6. **CE 2200** · Details of Construction *(Lab / Sessional)*
    7. **CE 2171** · Fluid Mechanics Lab *(Lab / Sessional)*
  - **Design Details:** ৩-কলামের (Desktop 3-col, Tablet 2-col, Mobile 1-col) কমপ্যাক্ট গ্রিড, Course Code ব্যাজ, Lab/Theory ক্যাটাগরি পিল, UIU ডিপার্টমেন্ট মেটাডাটা এবং ছোট কি-ট্যাগ চিপস।
  - **Verification:** টিচিং সেকশনে ৭টি কার্ড সমান গ্রিডে সুন্দরভাবে দেখাচ্ছে এবং কোনো অতিরিক্ত স্ক্রোল বা লেআউট সমস্যা তৈরি করছে না।

---

## 📌 Phase 3: Education & Thesis Section Update

- [ ] **Task 3.1: Clean up B.Sc. Timeline Item Chips**
  - **Target File:** `index.html` (প্রায় লাইন ১৬১–১৭৩)
  - **Context:** B.Sc. ডিগ্রির নিচে দেওয়া `.courses-list` চিপগুলো রিসার্চ ইন্টারেস্টের সাথে ওভারল্যাপ করছে।
  - **Action:** B.Sc. টাইমলাইন আইটেম থেকে `.courses-list` ডিভ ও চিপগুলো রিমুভ করা।

- [ ] **Task 3.2: Add B.Sc. Undergraduate Thesis Title & Supervisor**
  - **Target File:** `index.html` (B.Sc. Timeline Item)
  - **Context:** মিটিংয়ে শরণ বিশেষভাবে উল্লেখ করেছেন যে B.Sc. ডিগ্রির নিচে থিসিসের নাম অবশ্যই থাকতে হবে।
  - **Exact Content to Insert:**
    - **Thesis:** *Developing Crash Prediction Model for Highways Considering Land Use and Encroachment*
    - **Supervisor:** *Prof. Moinul Hossain, Ph.D., Professor, CEE, IUT*
  - **Verification:** Education টাইমলাইনে B.Sc.-র নিচে থিসিস টাইটেল ও সুপারভাইজারের নাম পরিচ্ছন্নভাবে ১-২ লাইনে প্রদর্শিত হচ্ছে কি না।

---

## 📌 Phase 4: Academic Project (FYDP) Showcase Refactoring

- [x] **Task 4.1: Retain Only FYDP as Featured Academic Project & Clean up Non-Projects**
  - **Target Files:** `index.html` (লাইন ৫৭৫–৬৩০), `styles.css`, এবং Command Palette Modal
  - **Context:** ইউজারের ফ্রেন্ডের সংশোধনী অনুযায়ী সেকশনে শুধুমাত্র Final Year Design Project (FYDP) থাকবে; বাকি ২টি নন-প্রজেক্ট আইটেম (যা অলরেডি পাবলিকেশন ও থিসিসে আছে) বাদ দেওয়া হয়েছে। এছাড়া ক্যারোসেল কন্ট্রোলস (arrows & dots) সরিয়ে একটি পরিচ্ছন্ন স্ট্যান্ডঅ্যালোন শোকেস কার্ড করা হয়েছে।
  - **Applied Changes:**
    - `<h2>` টাইটেল পরিবর্তন করে `Academic Project` করা হয়েছে।
    - সেকশন ট্যাগ `<span class="section-tag"><i class="fas fa-drafting-compass"></i> Academic Project</span>` সেট করা হয়েছে এবং অপ্রয়োজনীয় সাবটাইটেল মুছে ফেলে মার্জিন/স্পেসিং ব্যালেন্সড রাখা হয়েছে।
    - ক্যারোসেল র‍্যাপার ও বাটন রিমুভ করে `.project-card--standalone` যুক্ত করা হয়েছে।
    - Command Palette-এ অ্যাকশন টাইটেল `Academic Project` এ সিঙ্ক করা হয়েছে।

---

## 📌 Phase 5: Skills & Expertise Section Refinement

- [x] **Task 5.1: Rename Skills Section Heading**
  - **Target File:** `index.html` (লাইন ৬৭৩–৬৭৭)
  - **Action:** `"Technical Skills"` থেকে পরিবর্তন করে `"Skills & Expertise"` এবং সেকশন ট্যাগ `"Skills"` করা হয়েছে অন্যান্য সেকশনের প্যাটার্নের সাথে সামঞ্জস্য রেখে।

- [x] **Task 5.2: Align Skill Categories with CV**
  - **Target File:** `index.html` (লাইন ৬৭৮–৭১৬)
  - **Categories & Tools:**
    1. **Simulation & CAD Software:** AutoCAD, QGIS, SUMO, VISSIM, CUBE, ETABS, SAP2000, E-Tank, Zotero
    2. **Programming & Analytics:** Python, Matplotlib (with Cert Link), Seaborn (with Cert Link), Data Analytics, MS Excel
    3. **Language Proficiency:** English (IELTS Band 7.5), Bengali (Native)
  - **Verification:** সমস্ত টুল ও সফটওয়্যার ব্যাজ সঠিকভাবে রেন্ডার হচ্ছে এবং সার্টিফিকেট লিংকগুলো ঠিকমতো কাজ করছে।

---

## 📌 Phase 6: Global Consistency & Command Palette Sync

- [x] **Task 6.1: Sync Navigation & Command Palette (Cmd+K Modal)**
  - **Target File:** `index.html` (Navbar ও Command Palette Modal) ও `script.js`
  - **Action:** হেডিং বা সেকশন নামের পরিবর্তনের সাথে সামঞ্জস্য রেখে Navbar (`#skills -> Skills`) ও Command Palette (`<span>Skills & Expertise</span>`) সফলভাবে সিঙ্ক করা হয়েছে।

- [ ] **Task 6.2: Responsive & Visual Quality Check**
  - **Action:** মোবাইল, ট্যাবলেট এবং ডেস্কটপ ভিউতে সব পরিবর্তিত সেকশন নিখুঁতভাবে রেন্ডার হচ্ছে কি না এবং কনসোল এরর নেই কি না পরীক্ষা করা।

---

## 📌 Phase 7: Contact Information & Phone Number Integration

- [x] **Task 7.1: Add Phone Number Card in Contact Section & Footer Link**
  - **Target Files:** `index.html` (লাইন ৭৩৮–৭৫২ ও ৮১৫–৮২৫) এবং `cv.md` (লাইন ৩)
  - **Applied Changes:**
    - কন্টাক্ট সেকশনে সরাসরি কল করার জন্য `tel:+8801796549094` সহ ডেডিকেটেড ফোন কার্ড (`+880 1796-549094`) যোগ করা হয়েছে।
    - ওয়েবসাইটের ফুটার সোশ্যাল বারে ফোন আইকন বাটন (`<i class="fas fa-phone-alt"></i>`) যোগ করা হয়েছে।
    - `cv.md`-এর হেডার কন্টাক্ট লাইনে ফোন নম্বরটি সুন্দরভাবে ফরম্যাট করা হয়েছে।

