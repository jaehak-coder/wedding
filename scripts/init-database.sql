-- 웨딩홀 테이블
CREATE TABLE IF NOT EXISTS wedding_halls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  request_date TEXT,
  available_date TEXT,
  available_hall TEXT,
  location TEXT,
  style TEXT,
  meal_type TEXT,
  guest_count INTEGER,
  parking TEXT,
  price INTEGER,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 상견례 테이블
CREATE TABLE IF NOT EXISTS meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  venue TEXT,
  request_date TEXT,
  available_date TEXT,
  location TEXT,
  style TEXT,
  meal_type TEXT,
  price INTEGER,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 신혼집 테이블
CREATE TABLE IF NOT EXISTS newlywed_homes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complex_name TEXT NOT NULL,
  building_unit TEXT,
  direction TEXT,
  check_date TEXT,
  transaction_type TEXT,
  location TEXT,
  price INTEGER,
  years INTEGER,
  move_in_date TEXT,
  remodeling_needed BOOLEAN,
  realtor_fee INTEGER,
  registration_tax INTEGER,
  additional_tax INTEGER,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 신혼여행 테이블
CREATE TABLE IF NOT EXISTS honeymoons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination TEXT NOT NULL,
  duration TEXT,
  type TEXT,
  agency_meeting TEXT,
  agency1_quote TEXT,
  agency2_quote TEXT,
  agency3_quote TEXT,
  price INTEGER,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 웨딩촬영 테이블
CREATE TABLE IF NOT EXISTS wedding_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  vendor TEXT,
  quote_amount INTEGER,
  included_items TEXT,
  food_service TEXT,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 살림장만 테이블
CREATE TABLE IF NOT EXISTS household_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  price INTEGER,
  features TEXT,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 웨딩데이 준비 테이블
CREATE TABLE IF NOT EXISTS wedding_day_prep (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  item TEXT,
  budget INTEGER,
  selected_person TEXT,
  venue TEXT,
  guest_count INTEGER,
  actual_cost INTEGER,
  selected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT OR IGNORE INTO wedding_halls (name, request_date, available_date, location, guest_count, price) VALUES
('그랜드 웨딩홀', '25.12.06/12.13/12.14', '25.12.06/12.13/12.14', '강남구', 200, 15000000),
('로얄 웨딩홀', '25.12.06/12.13/12.14', '25.12.06/12.13/12.14', '서초구', 150, 12000000),
('프리미엄 웨딩홀', '25.12.06/12.13/12.14', '25.12.06/12.13/12.14', '송파구', 180, 13500000);

INSERT OR IGNORE INTO wedding_photos (category, vendor, quote_amount, included_items) VALUES
('스튜디오', '프리미엄 스튜디오', 2000000, '본식촬영, 드레스 2벌'),
('헤어메이크업', '뷰티살롱 A', 800000, '신부 메이크업, 헤어스타일링'),
('당일메이크업', '뷰티살롱 B', 500000, '당일 터치업'),
('드레스', '웨딩드레스샵', 1500000, '웨딩드레스 1벌, 컬러드레스 1벌'),
('한복', '한복대여점', 800000, '전통한복 1벌');

INSERT OR IGNORE INTO household_items (category, item_name, brand, price) VALUES
('가전제품', '냉장고', 'LG', 2500000),
('가전제품', 'TV', '삼성', 1800000),
('가전제품', '세탁기', 'LG', 1200000),
('가전제품', '건조기', '삼성', 1000000),
('가구', '침대', '시몬스', 3000000),
('가구', '장농', '한샘', 2000000),
('가구', '화장대', '이케아', 800000),
('가구', '소파', '에몬스', 2500000);

INSERT OR IGNORE INTO wedding_day_prep (category, item, budget, venue, guest_count) VALUES
('신랑신부', '예복 준비', 1000000, '웨딩홀', 2),
('축가', '축가 준비', 300000, '웨딩홀', 2),
('식순', '사회자', 500000, '웨딩홀', 1),
('준비는 사람', '웨딩플래너', 2000000, '웨딩홀', 1),
('볼드 식사팀', '식사 준비', 5000000, '웨딩홀', 200);
