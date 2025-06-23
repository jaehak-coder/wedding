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

interface Meeting {
  id: number
  type: string
  venue: string
  request_date: string
  available_date: string
  location: string
  style: string
  meal_type: string
  price: number
  actual_cost: number
  selected: boolean
}

interface MeetingManagerProps {
  onBack: () => void
}

export default function MeetingManager({ onBack }: MeetingManagerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()
  const [formData, setFormData] = useState({
    type: "",
    venue: "",
    request_date: "",
    available_date: "",
    location: "",
    style: "",
    meal_type: "",
    price: 0,
    actual_cost: 0,
  })

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    const selectedMeetings = getSelectedItemsByCategory("meetings")
    const mockMeetings: Meeting[] = [
      {
        id: 1,
        type: "집",
        venue: "신부집",
        request_date: "25.01.15",
        available_date: "25.01.15",
        location: "서울 강남구",
        style: "전통",
        meal_type: "한정식",
        price: 500000,
        actual_cost: 450000,
        selected: selectedMeetings.some((item) => item.id === 1),
      },
      {
        id: 2,
        type: "신랑",
        venue: "신랑집",
        request_date: "25.01.20",
        available_date: "25.01.20",
        location: "서울 서초구",
        style: "전통",
        meal_type: "한정식",
        price: 500000,
        actual_cost: 480000,
        selected: selectedMeetings.some((item) => item.id === 2),
      },
      {
        id: 3,
        type: "컵돈식당",
        venue: "고급 한정식당",
        request_date: "25.01.25",
        available_date: "25.01.25",
        location: "서울 중구",
        style: "모던",
        meal_type: "한정식",
        price: 800000,
        actual_cost: 750000,
        selected: selectedMeetings.some((item) => item.id === 3),
      },
    ]
    setMeetings(mockMeetings)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMeeting) {
      const updatedMeeting = { ...editingMeeting, ...formData }
      setMeetings(meetings.map((meeting) => (meeting.id === editingMeeting.id ? updatedMeeting : meeting)))

      // 선택된 항목이면 컨텍스트도 업데이트
      if (updatedMeeting.selected) {
        updateSelectedItem({
          id: updatedMeeting.id,
          category: "meetings",
          name: `${updatedMeeting.type} - ${updatedMeeting.venue}`,
          details: `${updatedMeeting.location}, ${updatedMeeting.style} 스타일, ${updatedMeeting.meal_type}`,
          estimatedCost: updatedMeeting.price,
          actualCost: updatedMeeting.actual_cost,
        })
      }
      setEditingMeeting(null)
    } else {
      const newMeeting: Meeting = {
        id: Date.now(),
        ...formData,
        selected: false,
      }
      setMeetings([...meetings, newMeeting])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      type: "",
      venue: "",
      request_date: "",
      available_date: "",
      location: "",
      style: "",
      meal_type: "",
      price: 0,
      actual_cost: 0,
    })
  }

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setFormData({
      type: meeting.type,
      venue: meeting.venue,
      request_date: meeting.request_date,
      available_date: meeting.available_date,
      location: meeting.location,
      style: meeting.style,
      meal_type: meeting.meal_type,
      price: meeting.price,
      actual_cost: meeting.actual_cost,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id))
    removeSelectedItem("meetings", id)
  }

  const toggleSelection = (meeting: Meeting) => {
    const updatedMeeting = { ...meeting, selected: !meeting.selected }
    setMeetings(meetings.map((m) => (m.id === meeting.id ? updatedMeeting : m)))

    if (updatedMeeting.selected) {
      addSelectedItem({
        id: meeting.id,
        category: "meetings",
        name: `${meeting.type} - ${meeting.venue}`,
        details: `${meeting.location}, ${meeting.style} 스타일, ${meeting.meal_type}`,
        estimatedCost: meeting.price,
        actualCost: meeting.actual_cost,
      })
    } else {
      removeSelectedItem("meetings", meeting.id)
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
          <h1 className="text-2xl font-bold">상견례</h1>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingMeeting(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              상견례 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMeeting ? "상견례 수정" : "상견례 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">구분</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venue">장소</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
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
                  <Label htmlFor="location">위치</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingMeeting ? "수정" : "추가"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className={`${meeting.selected ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>
                    {meeting.type} - {meeting.venue}
                  </span>
                  {meeting.selected && (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      선택됨
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={meeting.selected ? "destructive" : "default"}
                    onClick={() => toggleSelection(meeting)}
                  >
                    {meeting.selected ? (
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
                  <Button size="sm" variant="outline" onClick={() => handleEdit(meeting)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(meeting.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold">위치:</span> {meeting.location}
                </div>
                <div>
                  <span className="font-semibold">스타일:</span> {meeting.style}
                </div>
                <div>
                  <span className="font-semibold">식사:</span> {meeting.meal_type}
                </div>
                <div>
                  <span className="font-semibold">견적가격:</span> ₩{meeting.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">실제금액:</span> ₩{meeting.actual_cost.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">차액:</span>
                  <span className={meeting.price - meeting.actual_cost >= 0 ? "text-green-600" : "text-red-600"}>
                    ₩{(meeting.price - meeting.actual_cost).toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">요청날짜:</span> {meeting.request_date}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">가능날짜:</span> {meeting.available_date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
