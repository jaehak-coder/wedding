"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface SelectedItem {
  id: number
  category: string
  name: string
  details: string
  estimatedCost: number
  actualCost: number
}

interface WeddingPlanContextType {
  selectedItems: SelectedItem[]
  addSelectedItem: (item: SelectedItem) => void
  removeSelectedItem: (category: string, id: number) => void
  updateSelectedItem: (item: SelectedItem) => void
  getSelectedItemsByCategory: (category: string) => SelectedItem[]
}

const WeddingPlanContext = createContext<WeddingPlanContextType | undefined>(undefined)

export function WeddingPlanProvider({ children }: { children: React.ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  // 초기 데이터 로드
  useEffect(() => {
    const initialItems: SelectedItem[] = [
      // 웨딩홀
      {
        id: 1,
        category: "wedding-halls",
        name: "그랜드 웨딩홀",
        details: "강남구 위치, 200명 수용 가능, 모던 스타일",
        estimatedCost: 15000000,
        actualCost: 14500000,
      },
      // 웨딩촬영
      {
        id: 1,
        category: "wedding-photos",
        name: "스튜디오 - 프리미엄 스튜디오",
        details: "본식촬영, 드레스 2벌, 앨범 제작",
        estimatedCost: 2000000,
        actualCost: 1900000,
      },
      {
        id: 2,
        category: "wedding-photos",
        name: "헤어메이크업 - 뷰티살롱 A",
        details: "신부 메이크업, 헤어스타일링, 리허설",
        estimatedCost: 800000,
        actualCost: 750000,
      },
      {
        id: 5,
        category: "wedding-photos",
        name: "드레스 - 웨딩드레스샵",
        details: "웨딩드레스 1벌, 컬러드레스 1벌, 액세서리",
        estimatedCost: 1500000,
        actualCost: 1450000,
      },
      // 신혼집
      {
        id: 1,
        category: "newlywed-homes",
        name: "래미안 아파트",
        details: "101동 1501호, 남향, 매매",
        estimatedCost: 829000000,
        actualCost: 825000000,
      },
      // 신혼여행
      {
        id: 1,
        category: "honeymoons",
        name: "몰디브 5박 7일",
        details: "리조트, 25.01.20 미팅 완료",
        estimatedCost: 7500000,
        actualCost: 7200000,
      },
      // 상견례
      {
        id: 3,
        category: "meetings",
        name: "컵돈식당 - 고급 한정식당",
        details: "서울 중구, 모던 스타일, 한정식",
        estimatedCost: 800000,
        actualCost: 750000,
      },
      // 살림장만
      {
        id: 1,
        category: "household",
        name: "냉장고 - LG",
        details: "DIOS V8700, 양문형, 870L, 인버터 컴프레서",
        estimatedCost: 2500000,
        actualCost: 2300000,
      },
      {
        id: 2,
        category: "household",
        name: "TV - 삼성",
        details: "QLED 65인치, 4K, HDR, 스마트TV",
        estimatedCost: 1800000,
        actualCost: 1700000,
      },
      {
        id: 10,
        category: "household",
        name: "침대 - 시몬스",
        details: "뷰티레스트 블랙, 킹사이즈, 포켓스프링",
        estimatedCost: 3000000,
        actualCost: 2800000,
      },
      // 웨딩 Day 준비
      {
        id: 1,
        category: "wedding-day",
        name: "예복 준비",
        details: "신랑, 신부, 웨딩홀, 2명",
        estimatedCost: 1000000,
        actualCost: 950000,
      },
      {
        id: 2,
        category: "wedding-day",
        name: "축가 준비",
        details: "친구 A, 친구 B, 웨딩홀, 2명",
        estimatedCost: 300000,
        actualCost: 250000,
      },
      {
        id: 3,
        category: "wedding-day",
        name: "사회자",
        details: "전문 사회자, 웨딩홀, 1명",
        estimatedCost: 500000,
        actualCost: 500000,
      },
      {
        id: 4,
        category: "wedding-day",
        name: "웨딩플래너",
        details: "웨딩플래너 김OO, 웨딩홀, 1명",
        estimatedCost: 2000000,
        actualCost: 1800000,
      },
      {
        id: 5,
        category: "wedding-day",
        name: "식사 준비",
        details: "웨딩홀 케이터링, 웨딩홀, 200명",
        estimatedCost: 5000000,
        actualCost: 4800000,
      },
    ]
    setSelectedItems(initialItems)
  }, [])

  const addSelectedItem = (item: SelectedItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.category === item.category && i.id === item.id)
      if (exists) return prev
      return [...prev, item]
    })
  }

  const removeSelectedItem = (category: string, id: number) => {
    setSelectedItems((prev) => prev.filter((item) => !(item.category === category && item.id === id)))
  }

  const updateSelectedItem = (updatedItem: SelectedItem) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.category === updatedItem.category && item.id === updatedItem.id ? updatedItem : item)),
    )
  }

  const getSelectedItemsByCategory = (category: string) => {
    return selectedItems.filter((item) => item.category === category)
  }

  return (
    <WeddingPlanContext.Provider
      value={{
        selectedItems,
        addSelectedItem,
        removeSelectedItem,
        updateSelectedItem,
        getSelectedItemsByCategory,
      }}
    >
      {children}
    </WeddingPlanContext.Provider>
  )
}

export function useWeddingPlan() {
  const context = useContext(WeddingPlanContext)
  if (context === undefined) {
    throw new Error("useWeddingPlan must be used within a WeddingPlanProvider")
  }
  return context
}
