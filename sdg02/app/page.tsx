"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { foodItems, calculateImpact, type FoodItem } from "@/lib/food-data"

type Stage = "intro" | "select" | "report"

export default function ForgottenFridgeRevenge() {
  const [stage, setStage] = useState<Stage>("intro")
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([])

  const toggleItem = (item: FoodItem) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    )
  }

  const impact = calculateImpact(selectedItems)

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <IntroStage onStart={() => setStage("select")} />
        )}
        {stage === "select" && (
          <SelectStage
            items={foodItems}
            selectedItems={selectedItems}
            onToggle={toggleItem}
            onNext={() => setStage("report")}
          />
        )}
        {stage === "report" && (
          <ReportStage
            items={selectedItems}
            impact={impact}
            onReset={() => {
              setSelectedItems([])
              setStage("intro")
            }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function IntroStage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Fridge SVG */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative cursor-pointer group"
        onClick={onStart}
      >
        <svg
          width="200"
          height="320"
          viewBox="0 0 200 320"
          className="drop-shadow-2xl"
        >
          {/* Fridge body */}
          <rect
            x="20"
            y="10"
            width="160"
            height="300"
            rx="8"
            className="fill-[#e8eef2] stroke-[#b8c4cc]"
            strokeWidth="3"
          />
          {/* Freezer door */}
          <rect
            x="28"
            y="18"
            width="144"
            height="80"
            rx="4"
            className="fill-[#f5f8fa] stroke-[#c8d4dc] group-hover:fill-[#edf3f7]"
            strokeWidth="2"
          />
          {/* Main door */}
          <rect
            x="28"
            y="106"
            width="144"
            height="196"
            rx="4"
            className="fill-[#f5f8fa] stroke-[#c8d4dc] group-hover:fill-[#edf3f7]"
            strokeWidth="2"
          />
          {/* Freezer handle */}
          <rect
            x="150"
            y="45"
            width="6"
            height="30"
            rx="3"
            className="fill-[#a0aeb8]"
          />
          {/* Main handle */}
          <rect
            x="150"
            y="180"
            width="6"
            height="50"
            rx="3"
            className="fill-[#a0aeb8]"
          />
          {/* Glow effect on hover */}
          <motion.rect
            x="20"
            y="10"
            width="160"
            height="300"
            rx="8"
            fill="transparent"
            className="stroke-primary"
            strokeWidth="0"
            animate={{ strokeWidth: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>

        {/* Light glow */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-primary/20 blur-3xl -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-3xl md:text-5xl font-bold text-foreground text-center text-balance"
      >
        잊혀진 냉장고의 <span className="text-accent">복수</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-muted-foreground text-center max-w-sm text-pretty"
      >
        당신이 버리는 음식, 지구는 기억합니다
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
        className="mt-8 text-sm text-primary"
      >
        냉장고를 클릭하세요
      </motion.p>
    </motion.div>
  )
}

function SelectStage({
  items,
  selectedItems,
  onToggle,
  onNext,
}: {
  items: FoodItem[]
  selectedItems: FoodItem[]
  onToggle: (item: FoodItem) => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          오늘 버릴 음식을 선택하세요
        </h2>
        <p className="mt-2 text-muted-foreground text-sm">
          냉장고 속 유통기한이 지난 음식들
        </p>
      </motion.div>

      {/* Food grid inside fridge-like container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-[#f5f8fa] border-4 border-[#c8d4dc] rounded-xl p-6 md:p-8 max-w-md w-full"
      >
        {/* Fridge light effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-xl pointer-events-none" />

        <div className="grid grid-cols-3 gap-4 relative">
          {items.map((item, index) => {
            const isSelected = selectedItems.find((i) => i.id === item.id)
            return (
              <motion.button
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => onToggle(item)}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-xl
                  transition-all duration-200 border-2
                  ${
                    isSelected
                      ? "bg-destructive/20 border-destructive shadow-lg scale-105"
                      : "bg-white/80 border-transparent hover:bg-white hover:shadow-md"
                  }
                `}
              >
                <span className="text-4xl mb-2">{item.emoji}</span>
                <span className="text-xs text-foreground/80 font-medium">
                  {item.nameKr}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <span className="text-destructive-foreground text-xs">X</span>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Selected count and continue button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-col items-center gap-4"
      >
        {selectedItems.length > 0 && (
          <p className="text-muted-foreground text-sm">
            {selectedItems.length}개 선택됨
          </p>
        )}
        <button
          onClick={onNext}
          disabled={selectedItems.length === 0}
          className={`
            px-8 py-3 rounded-full font-semibold transition-all duration-300
            ${
              selectedItems.length > 0
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          {selectedItems.length > 0 ? "버리기" : "음식을 선택하세요"}
        </button>
      </motion.div>
    </motion.div>
  )
}

function ReportStage({
  items,
  impact,
  onReset,
}: {
  items: FoodItem[]
  impact: ReturnType<typeof calculateImpact>
  onReset: () => void
}) {
  const stats = [
    {
      label: "낭비된 물",
      value: impact.totalWater.toLocaleString(),
      unit: "L",
      description: `${impact.drinkingWaterDays}일치 식수`,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" />
        </svg>
      ),
    },
    {
      label: "탄소 배출",
      value: impact.totalCarbon.toFixed(1),
      unit: "kg CO2",
      description: `자동차 ${(impact.totalCarbon * 4).toFixed(0)}km 주행`,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
      ),
    },
    {
      label: "낭비된 비용",
      value: impact.totalPrice.toLocaleString(),
      unit: "원",
      description: `기아 아동 ${impact.mealsLost}끼 식사`,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Title with dramatic effect */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          당신이 버린 것들
        </h2>
        <div className="flex items-center justify-center gap-2 text-2xl">
          {items.map((item) => (
            <motion.span
              key={item.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {item.emoji}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid gap-4 md:gap-6 max-w-lg w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.15 }}
            className={`${stat.bgColor} rounded-2xl p-5 border border-foreground/10`}
          >
            <div className="flex items-start gap-4">
              <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <motion.span
                    className={`text-3xl md:text-4xl font-bold ${stat.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.15 }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-muted-foreground text-sm">{stat.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center text-muted-foreground text-sm max-w-sm text-pretty"
      >
        전 세계에서 생산되는 음식의 <span className="text-accent font-semibold">1/3</span>이 버려집니다.
        <br />
        작은 변화가 지구를 지킵니다.
      </motion.p>

      {/* Reset button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        onClick={onReset}
        className="mt-8 px-6 py-3 rounded-full border border-foreground/20 text-foreground/80 hover:bg-foreground/10 transition-colors"
      >
        다시 해보기
      </motion.button>
    </motion.div>
  )
}
