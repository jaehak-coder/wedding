import { NextResponse } from "next/server"

// 실제 선택된 항목들을 시뮬레이션
const mockSelectedItems = [
  {
    category: "wedding-halls",
    name: "그랜드 웨딩홀",
    details: "강남구 위치, 200명 수용 가능",
    price: 15000000,
  },
  {
    category: "wedding-photos",
    name: "프리미엄 스튜디오",
    details: "본식촬영, 드레스 2벌 포함",
    price: 2000000,
  },
  {
    category: "wedding-photos",
    name: "뷰티살롱 A",
    details: "신부 메이크업, 헤어스타일링",
    price: 800000,
  },
  {
    category: "wedding-photos",
    name: "웨딩드레스샵",
    details: "웨딩드레스 1벌, 컬러드레스 1벌",
    price: 1500000,
  },
  {
    category: "newlywed-homes",
    name: "래미안 아파트",
    details: "101동 1501호, 남향",
    price: 800000000,
  },
  {
    category: "honeymoons",
    name: "몰디브",
    details: "5박 7일, 리조트",
    price: 7500000,
  },
  {
    category: "household",
    name: "LG 냉장고",
    details: "양문형, 870L",
    price: 2500000,
  },
  {
    category: "household",
    name: "삼성 TV",
    details: "QLED 65인치",
    price: 1800000,
  },
  {
    category: "household",
    name: "시몬스 침대",
    details: "킹사이즈, 포켓스프링",
    price: 3000000,
  },
  {
    category: "wedding-day",
    name: "예복 준비",
    details: "신랑, 신부 예복",
    price: 1000000,
  },
  {
    category: "wedding-day",
    name: "축가 준비",
    details: "친구 A, 친구 B",
    price: 300000,
  },
  {
    category: "wedding-day",
    name: "사회자",
    details: "전문 사회자",
    price: 500000,
  },
  {
    category: "wedding-day",
    name: "웨딩플래너",
    details: "웨딩플래너 김OO",
    price: 2000000,
  },
  {
    category: "wedding-day",
    name: "식사 준비",
    details: "웨딩홀 케이터링, 200명",
    price: 5000000,
  },
  {
    category: "meetings",
    name: "고급 한정식당",
    details: "서울 중구, 모던 스타일",
    price: 800000,
  },
]

export async function GET() {
  try {
    // 실제 구현에서는 데이터베이스에서 selected=true인 항목들을 조회
    return NextResponse.json(mockSelectedItems)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch selected items" }, { status: 500 })
  }
}
