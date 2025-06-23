"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useWeddingPlan } from "../../contexts/WeddingPlanContext"

interface HouseholdItem {
  id: number
  category: string
  item_name: string
  brand: string
  model: string
  price: number
  actual_cost: number
  features: string
  selected: boolean
}

interface HouseholdManagerProps {
  onBack: () => void
}

export default function HouseholdManager({ onBack }: HouseholdManagerProps) {
  const [items, setItems] = useState<HouseholdItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<HouseholdItem | null>(null)
  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()
  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    brand: "",
    model: "",
    price: 0,
    actual_cost: 0,
    features: "",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const selectedHouseholdItems = getSelectedItemsByCategory("household")
    const mockItems: HouseholdItem[] = [
      // 가전제품
      {
        id: 1,
        category: "가전제품",
        item_name: "냉장고",
        brand: "LG",
        model: "DIOS V8700",
        price: 2500000,
        actual_cost: 2300000,
        features: "양문형, 870L, 인버터 컴프레서",
        selected: selectedHouseholdItems.some((item) => item.id === 1),
      },
      {
        id: 2,
        category: "가전제품",
        item_name: "TV",
        brand: "삼성",
        model: "QLED 65인치",
        price: 1800000,
        actual_cost: 1700000,
        features: "4K, HDR, 스마트TV",
        selected: selectedHouseholdItems.some((item) => item.id === 2),
      },
      {
        id: 3,
        category: "가전제품",
        item_name: "세탁기",
        brand: "LG",
        model: "TWINWash 21kg",
        price: 1200000,
        actual_cost: 1150000,
        features: "드럼세탁기, AI DD, 트윈워시",
        selected: selectedHouseholdItems.some((item) => item.id === 3),
      },
      {
        id: 4,
        category: "가전제품",
        item_name: "건조기",
        brand: "삼성",
        model: "DV16T8520BV",
        price: 1000000,
        actual_cost: 950000,
        features: "16kg, 히트펌프, 의류케어",
        selected: selectedHouseholdItems.some((item) => item.id === 4),
      },
      {
        id: 5,
        category: "가전제품",
        item_name: "청소기",
        brand: "다이슨",
        model: "V15 Detect",
        price: 800000,
        actual_cost: 750000,
        features: "무선, 레이저 먼지 감지",
        selected: selectedHouseholdItems.some((item) => item.id === 5),
      },
      {
        id: 6,
        category: "가전제품",
        item_name: "오븐",
        brand: "LG",
        model: "DIOS 스팀오븐",
        price: 600000,
        actual_cost: 580000,
        features: "스팀기능, 28L",
        selected: selectedHouseholdItems.some((item) => item.id === 6),
      },
      {
        id: 7,
        category: "가전제품",
        item_name: "인덕션",
        brand: "쿠쿠",
        model: "3구 인덕션",
        price: 400000,
        actual_cost: 380000,
        features: "3구, 터치패널",
        selected: selectedHouseholdItems.some((item) => item.id === 7),
      },
      {
        id: 8,
        category: "가전제품",
        item_name: "정수기",
        brand: "코웨이",
        model: "아이콘 정수기",
        price: 500000,
        actual_cost: 480000,
        features: "냉온정수, UV살균",
        selected: selectedHouseholdItems.some((item) => item.id === 8),
      },
      {
        id: 9,
        category: "가전제품",
        item_name: "식기세척기",
        brand: "삼성",
        model: "DW60A8050FS",
        price: 900000,
        actual_cost: 850000,
        features: "12인용, 하이브리드 건조",
        selected: selectedHouseholdItems.some((item) => item.id === 9),
      },
      // 가구
      {
        id: 10,
        category: "가구",
        item_name: "침대",
        brand: "시몬스",
        model: "뷰티레스트 블랙",
        price: 3000000,
        actual_cost: 2800000,
        features: "킹사이즈, 포켓스프링",
        selected: selectedHouseholdItems.some((item) => item.id === 10),
      },
      {
        id: 11,
        category: "가구",
        item_name: "장농",
        brand: "한샘",
        model: "시스템 옷장",
        price: 2000000,
        actual_cost: 1900000,
        features: "슬라이딩 도어, 맞춤제작",
        selected: selectedHouseholdItems.some((item) => item.id === 11),
      },
      {
        id: 12,
        category: "가구",
        item_name: "화장대",
        brand: "이케아",
        model: "HEMNES",
        price: 800000,
        actual_cost: 750000,
        features: "서랍 3개, 거울 포함",
        selected: selectedHouseholdItems.some((item) => item.id === 12),
      },
      {
        id: 13,
        category: "가구",
        item_name: "소파",
        brand: "에몬스",
        model: "3인용 소파",
        price: 2500000,
        actual_cost: 2300000,
        features: "천연가죽, 리클라이너",
        selected: selectedHouseholdItems.some((item) => item.id === 13),
      },
      {
        id: 14,
        category: "가구",
        item_name: "식탁",
        brand: "한샘",
        model: "대리석 식탁",
        price: 1500000,
        actual_cost: 1400000,
        features: "6인용, 대리석 상판",
        selected: selectedHouseholdItems.some((item) => item.id === 14),
      },
      {
        id: 15,
        category: "가구",
        item_name: "의자",
        brand: "허먼밀러",
        model: "에어론 체어",
        price: 1200000,
        actual_cost: 1100000,
        features: "메쉬, 인체공학적",
        selected: selectedHouseholdItems.some((item) => item.id === 15),
      },
      // 리모델링
      {
        id: 16,
        category: "리모델링",
        item_name: "드레스룸",
        brand: "한샘",
        model: "맞춤 드레스룸",
        price: 5000000,
        actual_cost: 4800000,
        features: "맞춤제작, LED 조명",
        selected: selectedHouseholdItems.some((item) => item.id === 16),
      },
      {
        id: 17,
        category: "리모델링",
        item_name: "도배",
        brand: "벽지전문업체",
        model: "전체 도배",
        price: 2000000,
        actual_cost: 1900000,
        features: "친환경 벽지, 전체 시공",
        selected: selectedHouseholdItems.some((item) => item.id === 17),
      },
      {
        id: 18,
        category: "리모델링",
        item_name: "보일러",
        brand: "경동나비엔",
        model: "콘덴싱 보일러",
        price: 1500000,
        actual_cost: 1450000,
        features: "고효율, 온수겸용",
        selected: selectedHouseholdItems.some((item) => item.id === 18),
      },
      {
        id: 19,
        category: "리모델링",
        item_name: "커튼",
        brand: "커튼전문점",
        model: "맞춤 커튼",
        price: 800000,
        actual_cost: 750000,
        features: "암막, 맞춤제작",
        selected: selectedHouseholdItems.some((item) => item.id === 19),
      },
      {
        id: 20,
        category: "리모델링",
        item_name: "주방용품",
        brand: "다양한 브랜드",
        model: "주방용품 세트",
        price: 1000000,
        actual_cost: 950000,
        features: "냄비, 프라이팬, 식기류",
        selected: selectedHouseholdItems.some((item) => item.id === 20),
      },
    ]
    setItems(mockItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingItem) {
      const updatedItem = { ...editingItem, ...formData }
      setItems(items.map((item) => (item.id === editingItem.id ? updatedItem : item)))

      // 선택된 항목이면 컨텍스트도 업데이트
      if (updatedItem.selected) {
        updateSelectedItem({
          id: updatedItem.id,
          category: "household",
          name: `${updatedItem.item_name} - ${updatedItem.brand}`,
          details: `${updatedItem.model}, ${updatedItem.features}`,
          estimatedCost: updatedItem.price,
          actualCost: updatedItem.actual_cost,
        })
      }
      setEditingItem(null)
    } else {
      const newItem: HouseholdItem = {
        id: Date.now(),
        ...formData,
        selected: false,
      }
      setItems([...items, newItem])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      category: "",
      item_name: "",
      brand: "",
      model: "",
      price: 0,
      actual_cost: 0,
      features: "",
    })
  }

  const handleEdit = (item: HouseholdItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      item_name: item.item_name,
      brand: item.brand,
      model: item.model,
      price: item.price,
      actual_cost: item.actual_cost,
      features: item.features,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    removeSelectedItem("household", id)
  }

  const toggleSelection = (item: HouseholdItem) => {
    const updatedItem = { ...item, selected: !item.selected }
    setItems(items.map((i) => (i.id === item.id ? updatedItem : i)))

    if (updatedItem.selected) {
      addSelectedItem({
        id: item.id,
        category: "household",
        name: `${item.item_name} - ${item.brand}`,
        details: `${item.model}, ${item.features}`,
        estimatedCost: item.price,
        actualCost: item.actual_cost,
      })
    } else {
      removeSelectedItem("household", item.id)
    }
  }

  const categories = ["가전제품", "가구", "리모델링"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">살림장만</h1>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingItem(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              항목 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "항목 수정" : "항목 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">구분</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">선택하세요</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="item_name">품목</Label>
                  <Input
                    id="item_name"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">브랜드</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="model">모델</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">견적가격</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="actual_cost">실제 지출금액</Label>
                  <Input
                    id="actual_cost"
                    type="number"
                    value={formData.actual_cost}
                    onChange={(e) => setFormData({ ...formData, actual_cost: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="features">특징</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingItem ? "수정" : "추가"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.category === category)
          if (categoryItems.length === 0) return null

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">{category}</h3>
              <div className="grid gap-3">
                {categoryItems.map((item) => (
                  <Card key={item.id} className={`${item.selected ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <span>
                            {item.item_name} - {item.brand}
                          </span>
                          {item.selected && (
                            <Badge className="bg-green-500">
                              <Check className="h-3 w-3 mr-1" />
                              선택됨
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={item.selected ? "destructive" : "default"}
                            onClick={() => toggleSelection(item)}
                          >
                            {item.selected ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                선택 해제
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                선택
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">모델:</span> {item.model}
                        </div>
                        <div>
                          <span className="font-semibold">견적가격:</span> ₩{item.price.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">실제금액:</span> ₩{item.actual_cost.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">차액:</span>
                          <span className={item.price - item.actual_cost >= 0 ? "text-green-600" : "text-red-600"}>
                            ₩{(item.price - item.actual_cost).toLocaleString()}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">특징:</span> {item.features}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
