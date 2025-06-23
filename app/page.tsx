"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, Home, Camera, Plane, ShoppingCart, Utensils, CheckCircle, Calculator } from "lucide-react"
import { useWeddingPlan } from "./contexts/WeddingPlanContext"
import WeddingHallManager from "./components/wedding-halls/WeddingHallManager"
import MeetingManager from "./components/meetings/MeetingManager"
import NewlywedHomeManager from "./components/newlywed-homes/NewlywedHomeManager"
import HoneymoonManager from "./components/honeymoons/HoneymoonManager"
import WeddingPhotoManager from "./components/wedding-photos/WeddingPhotoManager"
import HouseholdManager from "./components/household/HouseholdManager"
import WeddingDayManager from "./components/wedding-day/WeddingDayManager"
import BudgetSummaryManager from "./components/budget-summary/BudgetSummaryManager"

type Category =
  | "main"
  | "wedding-halls"
  | "meetings"
  | "newlywed-homes"
  | "honeymoons"
  | "wedding-photos"
  | "household"
  | "wedding-day"
  | "budget-summary"

export default function WeddingPlanningDashboard() {
  const [currentView, setCurrentView] = useState<Category>("main")
  const { selectedItems, getSelectedItemsByCategory } = useWeddingPlan()

  const categories = [
    { id: "wedding-halls", name: "웨딩홀 검정", icon: Heart, color: "bg-pink-500" },
    { id: "meetings", name: "상견례", icon: Calendar, color: "bg-blue-500" },
    { id: "newlywed-homes", name: "신혼집", icon: Home, color: "bg-green-500" },
    { id: "honeymoons", name: "신혼여행", icon: Plane, color: "bg-purple-500" },
    { id: "wedding-photos", name: "웨딩촬영", icon: Camera, color: "bg-yellow-500" },
    { id: "household", name: "살림장만", icon: ShoppingCart, color: "bg-indigo-500" },
    { id: "wedding-day", name: "웨딩 Day준비", icon: Utensils, color: "bg-red-500" },
    { id: "budget-summary", name: "지출합계", icon: Calculator, color: "bg-gray-600" },
  ]

  const totalEstimated = selectedItems.reduce((sum, item) => sum + item.estimatedCost, 0)
  const totalActual = selectedItems.reduce((sum, item) => sum + item.actualCost, 0)

  const renderCurrentView = () => {
    switch (currentView) {
      case "wedding-halls":
        return <WeddingHallManager onBack={() => setCurrentView("main")} />
      case "meetings":
        return <MeetingManager onBack={() => setCurrentView("main")} />
      case "newlywed-homes":
        return <NewlywedHomeManager onBack={() => setCurrentView("main")} />
      case "honeymoons":
        return <HoneymoonManager onBack={() => setCurrentView("main")} />
      case "wedding-photos":
        return <WeddingPhotoManager onBack={() => setCurrentView("main")} />
      case "household":
        return <HouseholdManager onBack={() => setCurrentView("main")} />
      case "wedding-day":
        return <WeddingDayManager onBack={() => setCurrentView("main")} />
      case "budget-summary":
        return <BudgetSummaryManager onBack={() => setCurrentView("main")} />
      default:
        return (
          <div className="flex gap-6">
            {/* 메인 컨텐츠 */}
            <div className="flex-1">
              <div className="text-center py-8 mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">현진 ♥ 재학 웨딩 플랜</h1>
                <p className="text-lg text-gray-600">우리의 특별한 날을 위한 완벽한 준비</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon
                  const categorySelectedItems = getSelectedItemsByCategory(category.id)
                  const selectedCount = categorySelectedItems.length

                  return (
                    <Card
                      key={category.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setCurrentView(category.id as Category)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded-lg ${category.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                          </div>
                        </div>
                        {selectedCount > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs w-fit">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {selectedCount}개 선택됨
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          {categorySelectedItems.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-xs text-gray-600 truncate">
                              • {item.name}
                            </div>
                          ))}
                          {categorySelectedItems.length > 2 && (
                            <div className="text-xs text-gray-500">+{categorySelectedItems.length - 2}개 더</div>
                          )}
                          {categorySelectedItems.length === 0 && (
                            <div className="text-xs text-gray-400">선택된 항목 없음</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* 오른쪽 선택사항 요약 */}
            <div className="w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto max-h-screen">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">최종 선택 항목</h2>

                {/* 예산 요약 */}
                <div className="mb-6 space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">총 견적금액</h3>
                    <p className="text-2xl font-bold text-blue-600">₩{totalEstimated.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">총 실제금액</h3>
                    <p className="text-2xl font-bold text-green-600">₩{totalActual.toLocaleString()}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${totalEstimated - totalActual >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                    <h3
                      className={`font-semibold mb-2 ${totalEstimated - totalActual >= 0 ? "text-green-800" : "text-red-800"}`}
                    >
                      총 차액
                    </h3>
                    <p
                      className={`text-2xl font-bold ${totalEstimated - totalActual >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ₩{Math.abs(totalEstimated - totalActual).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 선택된 항목들 */}
                <div className="space-y-4">
                  {selectedItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">아직 선택된 항목이 없습니다.</p>
                  ) : (
                    selectedItems.map((item, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-xs text-gray-600 uppercase">
                              {categories.find((cat) => cat.id === item.category)?.name || item.category}
                            </h4>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 메인 컨텐츠 */}
        <div className={`flex-1 ${currentView === "main" ? "" : "pr-80"} transition-all duration-300`}>
          <div className="p-6">{renderCurrentView()}</div>
        </div>

        {/* 사이드바 - 세부 페이지에서만 표시 */}
        {currentView !== "main" && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">최종 선택 항목</h2>

              <div className="mb-6 space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">총 견적금액</h3>
                  <p className="text-2xl font-bold text-blue-600">₩{totalEstimated.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">총 실제금액</h3>
                  <p className="text-2xl font-bold text-green-600">₩{totalActual.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">아직 선택된 항목이 없습니다.</p>
                ) : (
                  selectedItems.map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-xs text-gray-600 uppercase">
                            {categories.find((cat) => cat.id === item.category)?.name || item.category}
                          </h4>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        </div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
