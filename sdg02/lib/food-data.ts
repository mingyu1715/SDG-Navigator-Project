export interface FoodItem {
  id: string
  name: string
  nameKr: string
  emoji: string
  waterFootprint: number // liters per item
  price: number // KRW
  weight: number // kg per item
  carbonPerKg: number // kg CO2 per kg of waste
  color: string
}

export const foodItems: FoodItem[] = [
  {
    id: "apple",
    name: "Apple",
    nameKr: "사과",
    emoji: "🍎",
    waterFootprint: 70,
    price: 1500,
    weight: 0.2,
    carbonPerKg: 0.4,
    color: "#e74c3c",
  },
  {
    id: "milk",
    name: "Milk",
    nameKr: "우유",
    emoji: "🥛",
    waterFootprint: 255,
    price: 2500,
    weight: 1,
    carbonPerKg: 3.2,
    color: "#ecf0f1",
  },
  {
    id: "bread",
    name: "Bread",
    nameKr: "빵",
    emoji: "🍞",
    waterFootprint: 40,
    price: 3000,
    weight: 0.4,
    carbonPerKg: 1.5,
    color: "#d4a574",
  },
  {
    id: "meat",
    name: "Beef",
    nameKr: "소고기",
    emoji: "🥩",
    waterFootprint: 1500,
    price: 15000,
    weight: 0.3,
    carbonPerKg: 27,
    color: "#c0392b",
  },
  {
    id: "egg",
    name: "Eggs",
    nameKr: "계란",
    emoji: "🥚",
    waterFootprint: 200,
    price: 500,
    weight: 0.06,
    carbonPerKg: 4.8,
    color: "#ffeaa7",
  },
  {
    id: "cheese",
    name: "Cheese",
    nameKr: "치즈",
    emoji: "🧀",
    waterFootprint: 500,
    price: 5000,
    weight: 0.2,
    carbonPerKg: 13.5,
    color: "#f1c40f",
  },
]

export const MEAL_COST_KRW = 600 // Cost to feed one hungry child one meal

export function calculateImpact(items: FoodItem[]) {
  const totalWater = items.reduce((sum, item) => sum + item.waterFootprint, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  const totalCarbon = items.reduce(
    (sum, item) => sum + item.carbonPerKg * item.weight,
    0
  )

  const mealsLost = Math.floor(totalPrice / MEAL_COST_KRW)
  const drinkingWaterDays = Math.floor(totalWater / 2) // 2L per person per day

  return {
    totalWater,
    totalPrice,
    totalWeight,
    totalCarbon,
    mealsLost,
    drinkingWaterDays,
  }
}
