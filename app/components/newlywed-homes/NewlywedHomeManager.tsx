"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useWeddingPlan } from "../../contexts/WeddingPlanContext"

interface NewlywedHome {
  id: number
  complex_name: string
  building_unit: string
  direction: string
  check_date: string
  transaction_type: string
  location: string
  price: number
  years: number
  move_in_date: string
  remodeling_needed: boolean
  realtor_fee: number
  registration_tax: number
  additional_tax: number
  actual_cost: number
  selected: boolean
}

interface NewlywedHomeManagerProps {
  onBack: () => void
}

export default function NewlywedHomeManager({ onBack }: NewlywedHomeManagerProps) {
  const [homes, setHomes] = useState<NewlywedHome[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHome, setEditingHome] = useState<NewlywedHome | null>(null)
  const { addSelectedItem, removeSelectedItem, updateSelectedItem, getSelectedItemsByCategory } = useWeddingPlan()
  const [formData, setFormData] = useState({
    complex_name: "",
    building_unit: "",
    direction: "",
    check_date: "",
    transaction_type: "",
    location: "",
    price: 0,
    years: 0,
    move_in_date: "",
    remodeling_needed: false,
    realtor_fee: 0,
    registration_tax: 0,
    additional_tax: 0,
    actual_cost: 0,
  })

  useEffect(() => {
    fetchHomes()
  }, [])

  const fetchHomes = async () => {
    const selectedHomes = getSelectedItemsByCategory("newlywed-homes")
    const mockHomes: NewlywedHome[] = [
      {
        id: 1,
        complex_name: "래미안 아파트",
        building_unit: "101동 1501호",
        direction: "남향",
        check_date: "25.01.10",
        transaction_type: "매매",
        location: "서울 강남구",
        price: 800000000,
        years: 5,
        move_in_date: "25.03.01",
        remodeling_needed: true,
        realtor_fee: 8000000,
        registration_tax: 16000000,
        additional_tax: 5000000,
        actual_cost: 825000000,
        selected: selectedHomes.some((item) => item.id === 1),
      },
      {
        id: 2,
        complex_name: "힐스테이트 아파트",
        building_unit: "202동 1203호",
        direction: "동향",
        check_date: "25.01.15",
        transaction_type: "전세",
        location: "서울 서초구",
        price: 500000000,
        years: 2,
        move_in_date: "25.02.15",
        remodeling_needed: false,
        realtor_fee: 5000000,
        registration_tax: 0,
        additional_tax: 0,
        actual_cost: 505000000,
        selected: selectedHomes.some((item) => item.id === 2),
      },
    ]
    setHomes(mockHomes)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingHome) {
      const updatedHome = { ...editingHome, ...formData }
      setHomes(homes.map((home) => (home.id === editingHome.id ? updatedHome : home)))

      // 선택된 항목이면 컨텍스트도 업데이트
      if (updatedHome.selected) {
        updateSelectedItem({
          id: updatedHome.id,
          category: "newlywed-homes",
          name: updatedHome.complex_name,
          details: `${updatedHome.building_unit}, ${updatedHome.direction}, ${updatedHome.transaction_type}`,
          estimatedCost:
            updatedHome.price + updatedHome.realtor_fee + updatedHome.registration_tax + updatedHome.additional_tax,
          actualCost: updatedHome.actual_cost,
        })
      }
      setEditingHome(null)
    } else {
      const newHome: NewlywedHome = {
        id: Date.now(),
        ...formData,
        selected: false,
      }
      setHomes([...homes, newHome])
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      complex_name: "",
      building_unit: "",
      direction: "",
      check_date: "",
      transaction_type: "",
      location: "",
      price: 0,
      years: 0,
      move_in_date: "",
      remodeling_needed: false,
      realtor_fee: 0,
      registration_tax: 0,
      additional_tax: 0,
      actual_cost: 0,
    })
  }

  const handleEdit = (home: NewlywedHome) => {
    setEditingHome(home)
    setFormData({
      complex_name: home.complex_name,
      building_unit: home.building_unit,
      direction: home.direction,
      check_date: home.check_date,
      transaction_type: home.transaction_type,
      location: home.location,
      price: home.price,
      years: home.years,
      move_in_date: home.move_in_date,
      remodeling_needed: home.remodeling_needed,
      realtor_fee: home.realtor_fee,
      registration_tax: home.registration_tax,
      additional_tax: home.additional_tax,
      actual_cost: home.actual_cost,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setHomes(homes.filter((home) => home.id !== id))
    removeSelectedItem("newlywed-homes", id)
  }

  const toggleSelection = (home: NewlywedHome) => {
    const updatedHome = { ...home, selected: !home.selected }
    setHomes(homes.map((h) => (h.id === home.id ? updatedHome : h)))

    if (updatedHome.selected) {
      addSelectedItem({
        id: home.id,
        category: "newlywed-homes",
        name: home.complex_name,
        details: `${home.building_unit}, ${home.direction}, ${home.transaction_type}`,
        estimatedCost: home.price + home.realtor_fee + home.registration_tax + home.additional_tax,
        actualCost: home.actual_cost,
      })
    } else {
      removeSelectedItem("newlywed-homes", home.id)
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
          <h1 className="text-2xl font-bold">신혼집</h1>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingHome(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              신혼집 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHome ? "신혼집 수정" : "신혼집 추가"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complex_name">집들대상</Label>
                  <Input
                    id="complex_name"
                    value={formData.complex_name}
                    onChange={(e) => setFormData({ ...formData, complex_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="building_unit">분주대시장</Label>
                  <Input
                    id="building_unit"
                    value={formData.building_unit}
                    onChange={(e) => setFormData({ ...formData, building_unit: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="direction">방향</Label>
                  <Input
                    id="direction"
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="check_date">확인날짜</Label>
                  <Input
                    id="check_date"
                    value={formData.check_date}
                    onChange={(e) => setFormData({ ...formData, check_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="transaction_type">형태(매매, 위치)</Label>
                  <Input
                    id="transaction_type"
                    value={formData.transaction_type}
                    onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
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
                  <Label htmlFor="price">가격</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="years">연수</Label>
                  <Input
                    id="years"
                    type="number"
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="move_in_date">입주가능일</Label>
                  <Input
                    id="move_in_date"
                    value={formData.move_in_date}
                    onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="realtor_fee">부동산비</Label>
                  <Input
                    id="realtor_fee"
                    type="number"
                    value={formData.realtor_fee}
                    onChange={(e) => setFormData({ ...formData, realtor_fee: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="registration_tax">취등록세</Label>
                  <Input
                    id="registration_tax"
                    type="number"
                    value={formData.registration_tax}
                    onChange={(e) =>
                      setFormData({ ...formData, registration_tax: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="additional_tax">추가세금</Label>
                  <Input
                    id="additional_tax"
                    type="number"
                    value={formData.additional_tax}
                    onChange={(e) => setFormData({ ...formData, additional_tax: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="actual_cost">실제 총 지출금액</Label>
                  <Input
                    id="actual_cost"
                    type="number"
                    value={formData.actual_cost}
                    onChange={(e) => setFormData({ ...formData, actual_cost: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remodeling_needed"
                  checked={formData.remodeling_needed}
                  onCheckedChange={(checked) => setFormData({ ...formData, remodeling_needed: checked as boolean })}
                />
                <Label htmlFor="remodeling_needed">리모델링여부</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingHome ? "수정" : "추가"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {homes.map((home) => (
          <Card key={home.id} className={`${home.selected ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>{home.complex_name}</span>
                  {home.selected && (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      선택됨
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={home.selected ? "destructive" : "default"}
                    onClick={() => toggleSelection(home)}
                  >
                    {home.selected ? (
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
                  <Button size="sm" variant="outline" onClick={() => handleEdit(home)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(home.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold">동호수:</span> {home.building_unit}
                </div>
                <div>
                  <span className="font-semibold">방향:</span> {home.direction}
                </div>
                <div>
                  <span className="font-semibold">형태:</span> {home.transaction_type}
                </div>
                <div>
                  <span className="font-semibold">위치:</span> {home.location}
                </div>
                <div>
                  <span className="font-semibold">기본가격:</span> ₩{home.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">총 견적:</span> ₩
                  {(home.price + home.realtor_fee + home.registration_tax + home.additional_tax).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">실제금액:</span> ₩{home.actual_cost.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">차액:</span>
                  <span
                    className={
                      home.price + home.realtor_fee + home.registration_tax + home.additional_tax - home.actual_cost >=
                      0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ₩
                    {(
                      home.price +
                      home.realtor_fee +
                      home.registration_tax +
                      home.additional_tax -
                      home.actual_cost
                    ).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">연수:</span> {home.years}년
                </div>
                <div>
                  <span className="font-semibold">입주일:</span> {home.move_in_date}
                </div>
                <div>
                  <span className="font-semibold">리모델링:</span> {home.remodeling_needed ? "필요" : "불필요"}
                </div>
                <div>
                  <span className="font-semibold">부동산비:</span> ₩{home.realtor_fee.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
