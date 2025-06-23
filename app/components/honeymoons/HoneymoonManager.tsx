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

interface Honeymoon {
  id: number
  destination: string
  duration: string
  type: string
  agency_meeting: string
  agency1_quote: string
  agency2_quote: string
  agency3_quote: string
  price: number
  actual_cost: number
  selected: boolean
}

interface HoneymoonManagerProps {
  onBack: () => void
}

export default function HoneymoonManager({ onBack }: HoneymoonManagerProps) {
  const [honeymoons, setHoneymoons] = useState<Honeymoon[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHoneymoon, setEditingHoneymoon] = useState<Honeymoon | null>(null)
  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    type: "",
    agency_meeting: "",
    agency1_quote: "",
    agency2_quote: "",
    agency3_quote: "",
    price: 0,
    actual_cost: 0,
  })

  useEffect(() => {
    fetchHoneymoons()
  }, [])

  const fetchHoneymoons = async () => {
    const selectedHoneymoons = getSelectedItemsByCategory("honeymoons")
    const mockHoneymoons: Honeymoon[] = [
      {
        id: 1,
        destination: "몰디브",
        duration: "5박 7일",
        type: "리조트",
        agency_meeting: "25.01.20 미팅 완료",
        agency1_quote: "800만원",
        agency2_quote: "750만원",
        agency3_quote: "820만원",
        price: 7500000,
        actual_cost: 7200000,
        selected: selectedHoneymoons.some((item) => item.id === 1),
      },
      {
        id: 2,
        destination: "유럽 3개국",
        duration: "7박 9일",
        type: "패키지",
        agency_meeting: "25.01.25 미팅 예정",
        agency1_quote: "1200만원",
        agency2_quote: "1150만원",
        agency3_quote: "1300만원",
        price: 11500000,
        actual_cost: 11200000,
        selected: selectedHoneymoons.some((item) => item.id === 2),
      },
      {
        id: 3,
        destination: "하와이",
        duration: "4박 6일",
        type: "자유여행",
        agency_meeting: "25.01.30 미팅 예정",
        agency1_quote: "600만원",
        agency2_quote: "580만원",
        agency3_quote: "650만원",
        price: 5800000,
        actual_cost: 5600000,
        selected: selectedHoneymoons.some((item) => item.id === 3),
      },
    ]
    setHoneymoons(mockHoneymoons)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingHoneymoon) {
      const updatedHoneymoon = { ...editingHoneymoon, ...formData }
      setHoneymoons(
        honeymoons.map((honeymoon) => (honeymoon.id === editingHoneymoon.id ? updatedHoneymoon : honeymoon)),
      )

      // 선택된 항목이면 컨텍스트도 업데이트
      if (updatedHoneymoon.selected) {
        updateSelectedItem({
          id: updatedHoneymoon.id,
          category: "honeymoons",
          name: `${updatedHoneymoon.destination} ${updatedHoneymoon.duration}`,
          details: `${updatedHoneymoon.type}, ${updatedHoneymoon.agency_meeting}`,
          estimatedCost: updatedHoneymoon.price,
          actualCost: updatedHoneymoon.actual_cost,
        })
      }
      setEditingHoneymoon(null)
    } else {
      const newHoneymoon: Honeymoon = {
        id: Date.now(),
        ...formData,
        selected: false,
      }
      setHoneymoons([...honeymoons, newHoneymoon])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      destination: "",
      duration: "",
      type: "",
      agency_meeting: "",
      agency1_quote: "",
      agency2_quote: "",
      agency3_quote: "",
      price: 0,
      actual_cost: 0,
    })
  }

  const handleEdit = (honeymoon: Honeymoon) => {
    setEditingHoneymoon(honeymoon)
    setFormData({
      destination: honeymoon.destination,
      duration: honeymoon.duration,
      type: honeymoon.type,
      agency_meeting: honeymoon.agency_meeting,
      agency1_quote: honeymoon.agency1_quote,
      agency2_quote: honeymoon.agency2_quote,
      agency3_quote: honeymoon.agency3_quote,
      price: honeymoon.price,
      actual_cost: honeymoon.actual_cost,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setHoneymoons(honeymoons.filter((honeymoon) => honeymoon.id !== id))
    removeSelectedItem("honeymoons", id)
  }

  const toggleSelection = (honeymoon: Honeymoon) => {
    const updatedHoneymoon = { ...honeymoon, selected: !honeymoon.selected }
    setHoneymoons(honeymoons.map((h) => (h.id === honeymoon.id ? updatedHoneymoon : h)))

    if (updatedHoneymoon.selected) {
      addSelectedItem({
        id: honeymoon.id,
        category: "honeymoons",
        name: `${honeymoon.destination} ${honeymoon.duration}`,
        details: `${honeymoon.type}, ${honeymoon.agency_meeting}`,
        estimatedCost: honeymoon.price,
        actualCost: honeymoon.actual_cost,
      })
    } else {
      removeSelectedItem("honeymoons", honeymoon.id)
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
          <h1 className="text-2xl font-bold">신혼여행</h1>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingHoneymoon(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              신혼여행 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHoneymoon ? "신혼여행 수정" : "신혼여행 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">목적지</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">기간</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">형태</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="agency_meeting">여행사 미팅</Label>
                  <Input
                    id="agency_meeting"
                    value={formData.agency_meeting}
                    onChange={(e) => setFormData({ ...formData, agency_meeting: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="agency1_quote">여행사1 견적</Label>
                  <Input
                    id="agency1_quote"
                    value={formData.agency1_quote}
                    onChange={(e) => setFormData({ ...formData, agency1_quote: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="agency2_quote">여행사2 견적</Label>
                  <Input
                    id="agency2_quote"
                    value={formData.agency2_quote}
                    onChange={(e) => setFormData({ ...formData, agency2_quote: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="agency3_quote">여행사3 견적</Label>
                  <Input
                    id="agency3_quote"
                    value={formData.agency3_quote}
                    onChange={(e) => setFormData({ ...formData, agency3_quote: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">최종 견적가격</Label>
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
                <Button type="submit">{editingHoneymoon ? "수정" : "추가"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {honeymoons.map((honeymoon) => (
          <Card key={honeymoon.id} className={`${honeymoon.selected ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>
                    {honeymoon.destination} - {honeymoon.duration}
                  </span>
                  {honeymoon.selected && (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      선택됨
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={honeymoon.selected ? "destructive" : "default"}
                    onClick={() => toggleSelection(honeymoon)}
                  >
                    {honeymoon.selected ? (
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
                  <Button size="sm" variant="outline" onClick={() => handleEdit(honeymoon)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(honeymoon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">형태:</span> {honeymoon.type}
                </div>
                <div>
                  <span className="font-semibold">미팅:</span> {honeymoon.agency_meeting}
                </div>
                <div>
                  <span className="font-semibold">여행사1:</span> {honeymoon.agency1_quote}
                </div>
                <div>
                  <span className="font-semibold">여행사2:</span> {honeymoon.agency2_quote}
                </div>
                <div>
                  <span className="font-semibold">여행사3:</span> {honeymoon.agency3_quote}
                </div>
                <div>
                  <span className="font-semibold">견적가격:</span> ₩{honeymoon.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">실제금액:</span> ₩{honeymoon.actual_cost.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">차액:</span>
                  <span className={honeymoon.price - honeymoon.actual_cost >= 0 ? "text-green-600" : "text-red-600"}>
                    ₩{(honeymoon.price - honeymoon.actual_cost).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
