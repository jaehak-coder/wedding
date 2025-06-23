"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useWeddingPlan } from "../../contexts/WeddingPlanContext"

interface CategorySummary {
  category: string
  categoryName: string
  totalEstimated: number
  totalActual: number
  itemCount: number
  items: Array<{
    name: string
    estimatedCost: number
    actualCost: number
  }>
}

interface BudgetSummaryManagerProps {
  onBack: () => void
}

export default function BudgetSummaryManager({ onBack }: BudgetSummaryManagerProps) {
  const { selectedItems } = useWeddingPlan()
  const [budgetData, setBudgetData] = useState<CategorySummary[]>([])
  const [totalEstimated, setTotalEstimated] = useState(0)
  const [totalActual, setTotalActual] = useState(0)

  const categoryNames: Record<string, string> = {
    "wedding-halls": "웨딩홀",
    meetings: "상견례",
    "newlywed-homes": "신혼집",
    honeymoons: "신혼여행",
    "wedding-photos": "웨딩촬영",
    household: "살림장만",
    "wedding-day": "웨딩 Day 준비",
  }

  useEffect(() => {
    // 선택된 항목들을 카테고리별로 그룹화
    const groupedData: Record<string, CategorySummary> = {}

    selectedItems.forEach((item) => {
      if (!groupedData[item.category]) {
        groupedData[item.category] = {
          category: item.category,
          categoryName: categoryNames[item.category] || item.category,
          totalEstimated: 0,
          totalActual: 0,
          itemCount: 0,
          items: [],
        }
      }

      groupedData[item.category].totalEstimated += item.estimatedCost
      groupedData[item.category].totalActual += item.actualCost
      groupedData[item.category].itemCount += 1
      groupedData[item.category].items.push({
        name: item.name,
        estimatedCost: item.estimatedCost,
        actualCost: item.actualCost,
      })
    })

    const budgetArray = Object.values(groupedData)
    setBudgetData(budgetArray)

    const totalEst = budgetArray.reduce((sum, category) => sum + category.totalEstimated, 0)
    const totalAct = budgetArray.reduce((sum, category) => sum + category.totalActual, 0)

    setTotalEstimated(totalEst)
    setTotalActual(totalAct)
  }, [selectedItems])

  const getDifferenceIcon = (estimated: number, actual: number) => {
    const diff = estimated - actual
    if (diff > 0) return <TrendingDown className="h-4 w-4 text-green-600" />
    if (diff < 0) return <TrendingUp className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getDifferenceColor = (estimated: number, actual: number) => {
    const diff = estimated - actual
    if (diff > 0) return "text-green-600"
    if (diff < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
        <h1 className="text-2xl font-bold">지출합계</h1>
      </div>

      {/* 전체 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">총 견적금액</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">₩{totalEstimated.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">총 실제금액</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">₩{totalActual.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className={`${totalEstimated - totalActual >= 0 ? "bg-green-50" : "bg-red-50"}`}>
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium ${totalEstimated - totalActual >= 0 ? "text-green-800" : "text-red-800"}`}
            >
              총 차액
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getDifferenceIcon(totalEstimated, totalActual)}
              <p className={`text-2xl font-bold ${getDifferenceColor(totalEstimated, totalActual)}`}>
                ₩{Math.abs(totalEstimated - totalActual).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 상세 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">카테고리별 상세</h2>
        {budgetData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">선택된 항목이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          budgetData.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>{category.categoryName}</span>
                    <Badge variant="secondary">{category.itemCount}개 항목</Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-600">견적: </span>
                      <span className="font-semibold">₩{category.totalEstimated.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">실제: </span>
                      <span className="font-semibold">₩{category.totalActual.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getDifferenceIcon(category.totalEstimated, category.totalActual)}
                      <span
                        className={`font-semibold ${getDifferenceColor(category.totalEstimated, category.totalActual)}`}
                      >
                        ₩{Math.abs(category.totalEstimated - category.totalActual).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-600">견적: </span>
                          <span>₩{item.estimatedCost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">실제: </span>
                          <span>₩{item.actualCost.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 min-w-[100px]">
                          {getDifferenceIcon(item.estimatedCost, item.actualCost)}
                          <span className={`font-medium ${getDifferenceColor(item.estimatedCost, item.actualCost)}`}>
                            ₩{Math.abs(item.estimatedCost - item.actualCost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
