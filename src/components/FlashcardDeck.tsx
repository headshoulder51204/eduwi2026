"use client";

import React, { useState, useEffect } from "react";
import { StudyItem } from "@/types/study";
import { KatexRenderer } from "./KatexRenderer";
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Tag,
  Shuffle,
} from "lucide-react";

interface FlashcardDeckProps {
  items: StudyItem[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ items }) => {
  const [deck, setDeck] = useState<StudyItem[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastery, setMastery] = useState<Record<string, "mastered" | "review" | "hard">>({});

  // Sync items when parent filter changes
  useEffect(() => {
    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items]);

  const currentItem = deck[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const setCardMastery = (status: "mastered" | "review" | "hard", e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentItem) return;
    setMastery((prev) => ({ ...prev, [currentItem.id]: status }));
    handleNext();
  };

  if (!currentItem) {
    return (
      <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">선택된 과목에 플래시카드가 없습니다.</p>
      </div>
    );
  }

  const currentStatus = mastery[currentItem.id];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Deck Stats & Controls */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>
          카드 <strong className="text-blue-600 text-sm">{currentIndex + 1}</strong> / {deck.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Shuffle className="w-3.5 h-3.5" />
            카드 섞기
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="cursor-pointer min-h-[380px] p-8 rounded-3xl bg-white border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group select-none"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {currentItem.subjectName}
            </span>
            <span className="text-xs text-gray-400 font-medium">{currentItem.chapter}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
            <RotateCw className="w-4 h-4 animate-spin-slow" />
            <span>{isFlipped ? "앞면 보기" : "뒤집어 해설 보기"}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="my-auto py-6 text-center space-y-4">
          {!isFlipped ? (
            /* FRONT VIEW */
            <div className="space-y-4 animate-fadeIn">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-md">
                [핵심 주제]
              </span>
              <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                {currentItem.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 max-w-lg mx-auto">
                {currentItem.summary}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {currentItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200"
                  >
                    <Tag className="w-3 h-3 text-gray-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* BACK VIEW (Detailed Answer & Mnemonic) */
            <div className="space-y-4 text-left animate-fadeIn">
              {currentItem.mnemonic && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    시험장 3초 암기팁 (두문자)
                  </div>
                  <div className="text-base font-extrabold text-amber-900 mb-1">
                    {currentItem.mnemonic.phrase}
                  </div>
                  <div className="text-xs text-amber-800 whitespace-pre-line leading-relaxed">
                    {currentItem.mnemonic.details}
                  </div>
                </div>
              )}

              {currentItem.formula && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <KatexRenderer latex={currentItem.formula.latex} block />
                  <p className="text-xs text-gray-500 mt-1">{currentItem.formula.description}</p>
                </div>
              )}

              <div className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                <strong className="block text-gray-900 text-sm mb-1">상세 해설 & 요약</strong>
                {currentItem.summary}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Mastery Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {currentStatus === "mastered" && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 완벽히 암기함
              </span>
            )}
            {currentStatus === "review" && (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> 헷갈림 (복습 필요)
              </span>
            )}
            {currentStatus === "hard" && (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> 어려움 (집중 암기)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => setCardMastery("hard", e)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              어려움
            </button>
            <button
              onClick={(e) => setCardMastery("review", e)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              헷갈림
            </button>
            <button
              onClick={(e) => setCardMastery("mastered", e)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              완벽함
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Bottom Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          이전 카드
        </button>
        <span className="text-xs text-gray-400 font-medium">
          카드를 클릭하면 정답/해설이 뒤집힙니다
        </span>
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          다음 카드
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
