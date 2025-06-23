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

interface WeddingHall {
  id: number
  name: string
  request_date: string
  available_date: string
  available_hall?: string
  location: string
  style?: string
  meal_type?: string
  guest_count: number
  parking?: string
  price: number
  actual_cost: number
  selected: boolean
}

interface WeddingHallManagerProps {
  onBack: () => void
}

export default function WeddingHallManager({ onBack }: WeddingHallManagerProps) {
  const [halls, setHalls] = useState<WeddingHall[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHall, setEditingHall] = useState<WeddingHall | null>(null)
  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()
  const [formData, setFormData] = useState({
    name: "",
    request_date: "",
    available_date: "",
    available_hall: "",
    location: "",
    style: "",
    meal_type: "",
    guest_count: 0,
    parking: "",
    price: 0,
    actual_cost: 0,
  })

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    const selectedHalls = getSelectedItemsByCategory("wedding-halls")
    const mockHalls: WeddingHall[] = [
      {
        id: 1,
        name: "그랜드 웨딩홀",
        request_date: "25.12.06/12.13/12.14",
        available_date: "25.12.06/12.13/12.14",
        available_hall: "그랜드홀",
        location: "강남구",
        style: "모던",
        meal_type: "뷔페",
        guest_count: 200,
        parking: "가능",
        price: 15000000,
        actual_cost: 14500000,
        selected: selectedHalls.some((item) => item.id === 1),
      },
      {
        id: 2,
        name: "로얄 웨딩홀",
        request_date: "25.12.06/12.13/12.14",
        available_date: "25.12.06/12.13/12.14",
        available_hall: "로얄홀",
        location: "서초구",
        style: "클래식",
        meal_type: "코스요리",
        guest_count: 150,
        parking: "가능",
        price: 12000000,
        actual_cost: 11500000,
        selected: selectedHalls.some((item) => item.id === 2),
      },
      {
        id: 3,
        name: "프리미엄 웨딩홀",
        request_date: "25.12.06/12.13/12.14",
        available_date: "25.12.06/12.13/12.14",
        available_hall: "프리미엄홀",
        location: "송파구",
        style: "럭셔리",
        meal_type: "뷔페",
        guest_count: 180,
        parking: "가능",
        price: 13500000,
        actual_cost: 13000000,
        selected: selectedHalls.some((item) => item.id === 3),
      },
    ]
    setHalls(mockHalls)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingHall) {
      const updatedHall = { ...editingHall, ...formData }
      setHalls(halls.map((hall) => (hall.id === editingHall.id ? updatedHall : hall)))

      // 선택된 항목이면 컨텍스트도 업데이트
      if (updatedHall.selected) {
        updateSelectedItem({
          id: updatedHall.id,
          category: "wedding-halls",
          name: updatedHall.name,
          details: `${updatedHall.location} 위치, ${updatedHall.guest_count}명 수용 가능, ${updatedHall.style} 스타일`,
          estimatedCost: updatedHall.price,
          actualCost: updatedHall.actual_cost,
        })
      }
      setEditingHall(null)
    } else {
      const newHall: WeddingHall = {
        id: Date.now(),
        ...formData,
        selected: false,
      }
      setHalls([...halls, newHall])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      request_date: "",
      available_date: "",
      available_hall: "",
      location: "",
      style: "",
      meal_type: "",
      guest_count: 0,
      parking: "",
      price: 0,
      actual_cost: 0,
    })
  }

  const handleEdit = (hall: WeddingHall) => {
    setEditingHall(hall)
    setFormData({
      name: hall.name,
      request_date: hall.request_date,
      available_date: hall.available_date,
      available_hall: hall.available_hall || "",
      location: hall.location,
      style: hall.style || "",
      meal_type: hall.meal_type || "",
      guest_count: hall.guest_count,
      parking: hall.parking || "",
      price: hall.price,
      actual_cost: hall.actual_cost,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setHalls(halls.filter((hall) => hall.id !== id))
    removeSelectedItem("wedding-halls", id)
  }

  const toggleSelection = (hall: WeddingHall) => {
    const updatedHall = { ...hall, selected: !hall.selected }
    setHalls(halls.map((h) => (h.id === hall.id ? updatedHall : h)))

    if (updatedHall.selected) {
      addSelectedItem({
        id: hall.id,
        category: "wedding-halls",
        name: hall.name,
        details: `${hall.location} 위치, ${hall.guest_count}명 수용 가능, ${hall.style} 스타일`,
        estimatedCost: hall.price,
        actualCost: hall.actual_cost,
      })
    } else {
      removeSelectedItem("wedding-halls", hall.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">웨딩홀 검정</h1>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingHall(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              웨딩홀 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHall ? "웨딩홀 수정" : "웨딩홀 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">웨딩홀명</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">위치</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="request_date">요청날짜</Label>
                  <Input
                    id="request_date"
                    value={formData.request_date}
                    onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="available_date">가능날짜</Label>
                  <Input
                    id="available_date"
                    value={formData.available_date}
                    onChange={(e) => setFormData({ ...formData, available_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="available_hall">가능한 홀</Label>
                  <Input
                    id="available_hall"
                    value={formData.available_hall}
                    onChange={(e) => setFormData({ ...formData, available_hall: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="style">스타일</Label>
                  <Input
                    id="style"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="meal_type">식사형리더</Label>
                  <Input
                    id="meal_type"
                    value={formData.meal_type}
                    onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="guest_count">하객수</Label>
                  <Input
                    id="guest_count"
                    type="number"
                    value={formData.guest_count}
                    onChange={(e) => setFormData({ ...formData, guest_count: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="parking">주차장</Label>
                  <Input
                    id="parking"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">가격</Label>
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingHall ? "수정" : "추가"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {halls.map((hall) => (
          <Card key={hall.id} className={`${hall.selected ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>{hall.name}</span>
                  {hall.selected && (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      선택됨
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={hall.selected ? "destructive" : "default"}
                    onClick={() => toggleSelection(hall)}
                  >
                    {hall.selected ? (
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
                  <Button size="sm" variant="outline" onClick={() => handleEdit(hall)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(hall.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold">위치:</span> {hall.location}
                </div>
                <div>
                  <span className="font-semibold">하객수:</span> {hall.guest_count}명
                </div>
                <div>
                  <span className="font-semibold">스타일:</span> {hall.style}
                </div>
                <div>
                  <span className="font-semibold">가격:</span> ₩{hall.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">실제금액:</span> ₩{hall.actual_cost.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">차액:</span>
                  <span className={hall.price - hall.actual_cost >= 0 ? "text-green-600" : "text-red-600"}>
                    ₩{(hall.price - hall.actual_cost).toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">요청날짜:</span> {hall.request_date}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">가능날짜:</span> {hall.available_date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
