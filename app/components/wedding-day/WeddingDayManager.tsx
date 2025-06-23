"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useWeddingPlan } from "../../contexts/WeddingPlanContext"

interface WeddingDayItem {
  id: number
  category: string
  item: string
  budget: number
  selected_person: string
  venue: string
  guest_count: number
  actual_cost: number
  selected: boolean
}

interface WeddingDayManagerProps {
  onBack: () => void
}

export default function WeddingDayManager({ onBack }: WeddingDayManagerProps) {
  const [items, setItems] = useState<WeddingDayItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WeddingDayItem | null>(null)
  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()
  const [formData, setFormData] = useState({
    category: "",
    item: "",
    budget: 0,
    selected_person: "",
    venue: "",
    guest_count: 0,
    actual_cost: 0,
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const selectedWeddingDayItems = getSelectedItemsByCategory("wedding-day")
    const mockItems: WeddingDayItem[] = [
      {
        id: 1,
        category: "신랑신부",
        item: "예복 준비",
        budget: 1000000,
        selected_person: "신랑, 신부",
        venue: "웨딩홀",
        guest_count: 2,
        actual_cost: 950000,
        selected: selectedWeddingDayItems.some((item) => item.id === 1),
      },
      {
        id: 2,
        category: "축가",
        item: "축가 준비",
        budget: 300000,
        selected_person: "친구 A, 친구 B",
        venue: "웨딩홀",
        guest_count: 2,
        actual_cost: 250000,
        selected: selectedWeddingDayItems.some((item) => item.id === 2),
      },
      {
        id: 3,
        category: "식순",
        item: "사회자",
        budget: 500000,
        selected_person: "전문 사회자",
        venue: "웨딩홀",
        guest_count: 1,
        actual_cost: 500000,
        selected: selectedWeddingDayItems.some((item) => item.id === 3),
      },
      {
        id: 4,
        category: "준비는 사람",
        item: "웨딩플래너",
        budget: 2000000,
        selected_person: "웨딩플래너 김OO",
        venue: "웨딩홀",
        guest_count: 1,
        actual_cost: 1800000,
        selected: selectedWeddingDayItems.some((item) => item.id === 4),
      },
      {
        id: 5,
        category: "볼드 식사팀",
        item: "식사 준비",
        budget: 5000000,
        selected_person: "웨딩홀 케이터링",
        venue: "웨딩홀",
        guest_count: 200,
        actual_cost: 4800000,
        selected: selectedWeddingDayItems.some((item) => item.id === 5),
      },
      {
        id: 6,
        category: "신랑신부",
        item: "부케 준비",
        budget: 200000,
        selected_person: "플로리스트",
        venue: "웨딩홀",
        guest_count: 1,
        actual_cost: 180000,
        selected: selectedWeddingDayItems.some((item) => item.id === 6),
      },
      {
        id: 7,
        category: "식순",
        item: "축사",
        budget: 100000,
        selected_person: "양가 어른",
        venue: "웨딩홀",
        guest_count: 2,
        actual_cost: 100000,
        selected: selectedWeddingDayItems.some((item) => item.id === 7),
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
          category: "wedding-day",
          name: updatedItem.item,
          details: `${updatedItem.selected_person}, ${updatedItem.venue}, ${updatedItem.guest_count}명`,
          estimatedCost: updatedItem.budget,
          actualCost: updatedItem.actual_cost,
        })
      }
      setEditingItem(null)
    } else {
      const newItem: WeddingDayItem = {
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
      item: "",
      budget: 0,
      selected_person: "",
      venue: "",
      guest_count: 0,
      actual_cost: 0,
    })
  }

  const handleEdit = (item: WeddingDayItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      item: item.item,
      budget: item.budget,
      selected_person: item.selected_person,
      venue: item.venue,
      guest_count: item.guest_count,
      actual_cost: item.actual_cost,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    removeSelectedItem("wedding-day", id)
  }

  const toggleSelection = (item: WeddingDayItem) => {
    const updatedItem = { ...item, selected: !item.selected }
    setItems(items.map((i) => (i.id === item.id ? updatedItem : i)))

    if (updatedItem.selected) {
      addSelectedItem({
        id: item.id,
        category: "wedding-day",
        name: item.item,
        details: `${item.selected_person}, ${item.venue}, ${item.guest_count}명`,
        estimatedCost: item.budget,
        actualCost: item.actual_cost,
      })
    } else {
      removeSelectedItem("wedding-day", item.id)
    }
  }

  const categories = ["신랑신부", "축가", "식순", "준비는 사람", "볼드 식사팀"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">웨딩 Day 준비</h1>
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
                  <Label htmlFor="category">항목</Label>
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
                  <Label htmlFor="item">세부항목</Label>
                  <Input
                    id="item"
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="budget">예산</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="actual_cost">실제비용</Label>
                  <Input
                    id="actual_cost"
                    type="number"
                    value={formData.actual_cost}
                    onChange={(e) => setFormData({ ...formData, actual_cost: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="selected_person">선정자</Label>
                  <Input
                    id="selected_person"
                    value={formData.selected_person}
                    onChange={(e) => setFormData({ ...formData, selected_person: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="venue">장소</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="guest_count">인원수</Label>
                  <Input
                    id="guest_count"
                    type="number"
                    value={formData.guest_count}
                    onChange={(e) => setFormData({ ...formData, guest_count: Number.parseInt(e.target.value) || 0 })}
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
                          <span>{item.item}</span>
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">선정자:</span> {item.selected_person}
                        </div>
                        <div>
                          <span className="font-semibold">장소:</span> {item.venue}
                        </div>
                        <div>
                          <span className="font-semibold">인원:</span> {item.guest_count}명
                        </div>
                        <div>
                          <span className="font-semibold">예산:</span> ₩{item.budget.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">실제비용:</span> ₩{item.actual_cost.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">차액:</span>
                          <span className={item.budget - item.actual_cost >= 0 ? "text-green-600" : "text-red-600"}>
                            ₩{(item.budget - item.actual_cost).toLocaleString()}
                          </span>
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
