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

interface WeddingPhoto {
  id: number
  category: string
  vendor: string
  quote_amount: number
  actual_cost: number
  included_items: string
  food_service: string
  selected: boolean
}

interface WeddingPhotoManagerProps {
  onBack: () => void
}

export default function WeddingPhotoManager({ onBack }: WeddingPhotoManagerProps) {
  const [photos, setPhotos] = useState<WeddingPhoto[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<WeddingPhoto | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    vendor: "",
    quote_amount: 0,
    actual_cost: 0,
    included_items: "",
    food_service: "",
  })

  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    const selectedPhotos = getSelectedItemsByCategory("wedding-photos")
    // 기존 mockPhotos 배열에서 selected 값을 selectedPhotos와 비교하여 설정
    const mockPhotos: WeddingPhoto[] = [
      {
        id: 1,
        category: "스튜디오",
        vendor: "프리미엄 스튜디오",
        quote_amount: 2000000,
        actual_cost: 1900000,
        included_items: "본식촬영, 드레스 2벌, 앨범 제작",
        food_service: "촬영 중 간식 제공",
        selected: selectedPhotos.some((item) => item.id === 1),
      },
      {
        id: 2,
        category: "헤어메이크업",
        vendor: "뷰티살롱 A",
        quote_amount: 800000,
        actual_cost: 750000,
        included_items: "신부 메이크업, 헤어스타일링, 리허설",
        food_service: "없음",
        selected: selectedPhotos.some((item) => item.id === 2),
      },
      {
        id: 3,
        category: "당일메이크업",
        vendor: "뷰티살롱 B",
        quote_amount: 500000,
        actual_cost: 500000,
        included_items: "당일 터치업, 헤어 재정리",
        food_service: "없음",
        selected: selectedPhotos.some((item) => item.id === 3),
      },
      {
        id: 4,
        category: "혼주메이크업",
        vendor: "뷰티살롱 C",
        quote_amount: 300000,
        actual_cost: 280000,
        included_items: "혼주 메이크업, 헤어스타일링",
        food_service: "없음",
        selected: selectedPhotos.some((item) => item.id === 4),
      },
      {
        id: 5,
        category: "드레스",
        vendor: "웨딩드레스샵",
        quote_amount: 1500000,
        actual_cost: 1400000,
        included_items: "웨딩드레스 1벌, 컬러드레스 1벌, 액세서리",
        food_service: "피팅 시 음료 제공",
        selected: selectedPhotos.some((item) => item.id === 5),
      },
      {
        id: 6,
        category: "한복",
        vendor: "한복대여점",
        quote_amount: 800000,
        actual_cost: 700000,
        included_items: "전통한복 1벌, 액세서리 일체",
        food_service: "없음",
        selected: selectedPhotos.some((item) => item.id === 6),
      },
      {
        id: 7,
        category: "촬영장",
        vendor: "야외촬영 전문",
        quote_amount: 1200000,
        actual_cost: 1100000,
        included_items: "야외 로케이션 3곳, 이동차량",
        food_service: "촬영 중 도시락 제공",
        selected: selectedPhotos.some((item) => item.id === 7),
      },
    ]
    setPhotos(mockPhotos)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPhoto) {
      setPhotos(photos.map((photo) => (photo.id === editingPhoto.id ? { ...photo, ...formData } : photo)))
      setEditingPhoto(null)
    } else {
      const newPhoto: WeddingPhoto = {
        id: Date.now(),
        ...formData,
        selected: false,
      }
      setPhotos([...photos, newPhoto])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      category: "",
      vendor: "",
      quote_amount: 0,
      actual_cost: 0,
      included_items: "",
      food_service: "",
    })
  }

  const handleEdit = (photo: WeddingPhoto) => {
    setEditingPhoto(photo)
    setFormData({
      category: photo.category,
      vendor: photo.vendor,
      quote_amount: photo.quote_amount,
      actual_cost: photo.actual_cost,
      included_items: photo.included_items,
      food_service: photo.food_service,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setPhotos(photos.filter((photo) => photo.id !== id))
  }

  const toggleSelection = (photo: WeddingPhoto) => {
    const updatedPhoto = { ...photo, selected: !photo.selected }
    setPhotos(photos.map((p) => (p.id === photo.id ? updatedPhoto : p)))

    if (updatedPhoto.selected) {
      addSelectedItem({
        id: photo.id,
        category: "wedding-photos",
        name: `${photo.category} - ${photo.vendor}`,
        details: photo.included_items,
        estimatedCost: photo.quote_amount,
        actualCost: photo.actual_cost,
      })
    } else {
      removeSelectedItem("wedding-photos", photo.id)
    }
  }

  const categories = ["스튜디오", "헤어메이크업", "당일메이크업", "혼주메이크업", "드레스", "한복", "촬영장"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">웨딩촬영</h1>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingPhoto(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              촬영 항목 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPhoto ? "촬영 항목 수정" : "촬영 항목 추가"}</DialogTitle>
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
                  <Label htmlFor="vendor">업체</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="quote_amount">견적금액</Label>
                  <Input
                    id="quote_amount"
                    type="number"
                    value={formData.quote_amount}
                    onChange={(e) => setFormData({ ...formData, quote_amount: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="actual_cost">실제 지출금액</Label>
                  <Input
                    id="actual_cost"
                    type="number"
                    value={formData.actual_cost}
                    onChange={(e) => setFormData({ ...formData, actual_cost: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="included_items">포함사항</Label>
                  <Textarea
                    id="included_items"
                    value={formData.included_items}
                    onChange={(e) => setFormData({ ...formData, included_items: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="food_service">음식사항</Label>
                  <Input
                    id="food_service"
                    value={formData.food_service}
                    onChange={(e) => setFormData({ ...formData, food_service: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingPhoto ? "수정" : "추가"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const categoryPhotos = photos.filter((photo) => photo.category === category)
          if (categoryPhotos.length === 0) return null

          return (
            <div key={category} className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">{category}</h3>
              {categoryPhotos.map((photo) => (
                <Card key={photo.id} className={`${photo.selected ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{photo.vendor}</span>
                        {photo.selected && (
                          <Badge className="bg-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            선택됨
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={photo.selected ? "destructive" : "default"}
                          onClick={() => toggleSelection(photo)}
                        >
                          {photo.selected ? (
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
                        <Button size="sm" variant="outline" onClick={() => handleEdit(photo)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(photo.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">견적금액:</span> ₩{photo.quote_amount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">실제금액:</span> ₩{photo.actual_cost.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">차액:</span>
                        <span
                          className={photo.quote_amount - photo.actual_cost >= 0 ? "text-green-600" : "text-red-600"}
                        >
                          ₩{(photo.quote_amount - photo.actual_cost).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">포함사항:</span> {photo.included_items}
                      </div>
                      <div>
                        <span className="font-semibold">음식사항:</span> {photo.food_service}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
