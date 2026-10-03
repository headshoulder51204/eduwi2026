"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { StudyItem } from "@/types/study";
import { KatexRenderer } from "./KatexRenderer";
import {
  getSavedCardMastery,
  saveCardMastery,
  CardStatus,
} from "@/lib/storage";
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
  Volume2,
  VolumeX,
  Flame,
  Layers,
} from "lucide-react";

interface FlashcardDeckProps {
  items: StudyItem[];
  initialFilterHardOnly?: boolean;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  items,
  initialFilterHardOnly = false,
}) => {
  const [mastery, setMastery] = useState<Record<string, CardStatus>>({});
  const [filterHardOnly, setFilterHardOnly] = useState(initialFilterHardOnly);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const ttsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load mastery from localStorage on mount
  useEffect(() => {
    setMastery(getSavedCardMastery());
  }, []);

  // Filter deck based on mastery status if requested
  const deck = React.useMemo(() => {
    if (!filterHardOnly) return items;
    return items.filter(
      (item) => mastery[item.id] === "hard" || mastery[item.id] === "review"
    );
  }, [items, filterHardOnly, mastery]);

  const currentItem = deck[currentIndex];

  // Stop TTS safely
  const stopTTS = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimerRef.current) {
      clearTimeout(ttsTimerRef.current);
      ttsTimerRef.current = null;
    }
    setIsAudioPlaying(false);
  }, []);

  // Sync index when deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    stopTTS();
  }, [items, filterHardOnly, stopTTS]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, [stopTTS]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (deck.length > 0 ? (prev + 1) % deck.length : 0));
  }, [deck.length]);

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) =>
      deck.length > 0 ? (prev - 1 + deck.length) % deck.length : 0
    );
  };

  const handleShuffle = () => {
    stopTTS();
    // Shuffles by moving to a random index
    if (deck.length > 1) {
      const nextIdx = Math.floor(Math.random() * deck.length);
      setCurrentIndex(nextIdx);
      setIsFlipped(false);
    }
  };

  const setCardMasteryStatus = (
    status: CardStatus,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!currentItem) return;
    const updated = saveCardMastery(currentItem.id, status);
    setMastery(updated);
    handleNext();
  };

  // TTS audio playback sequence
  const playCurrentCardTTS = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !currentItem) {
      return;
    }

    window.speechSynthesis.cancel();

    // 1. Speak Card Front
    const frontText = `${currentItem.subjectName}. ${currentItem.title}. ${currentItem.summary}`;
    const utteranceFront = new SpeechSynthesisUtterance(frontText);
    utteranceFront.lang = "ko-KR";
    utteranceFront.rate = 1.0;

    utteranceFront.onend = () => {
      // 2. Wait 2 seconds, flip card, and speak answer/mnemonic
      ttsTimerRef.current = setTimeout(() => {
        setIsFlipped(true);

        const mnemonicText = currentItem.mnemonic
          ? `암기팁. ${currentItem.mnemonic.phrase}. ${currentItem.mnemonic.details}`
          : "정답 및 해설을 확인하세요.";

        const utteranceBack = new SpeechSynthesisUtterance(mnemonicText);
        utteranceBack.lang = "ko-KR";
        utteranceBack.rate = 0.95;

        utteranceBack.onend = () => {
          // 3. Wait 2.5 seconds, then move to next card and continue playing
          ttsTimerRef.current = setTimeout(() => {
            handleNext();
          }, 2500);
        };

        window.speechSynthesis.speak(utteranceBack);
      }, 2000);
    };

    window.speechSynthesis.speak(utteranceFront);
  }, [currentItem, handleNext]);

  // When audio playing is active and index changes, play next card
  useEffect(() => {
    if (isAudioPlaying && currentItem) {
      playCurrentCardTTS();
    }
  }, [isAudioPlaying, currentIndex, currentItem, playCurrentCardTTS]);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopTTS();
    } else {
      setIsAudioPlaying(true);
    }
  };

  if (!currentItem) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
        <Layers className="w-12 h-12 text-slate-400 mx-auto" />
        <h4 className="text-base font-bold text-slate-800">
          {filterHardOnly
            ? "복습이 필요한 카드가 없습니다! 모두 마스터하셨습니다. 🎉"
            : "선택된 과목에 카드가 없습니다."}
        </h4>
        {filterHardOnly && (
          <button
            onClick={() => setFilterHardOnly(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow transition-all"
          >
            전체 카드 모드로 돌아가기
          </button>
        )}
      </div>
    );
  }

  const currentStatus = mastery[currentItem.id];
  const hardCount = items.filter(
    (i) => mastery[i.id] === "hard" || mastery[i.id] === "review"
  ).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Deck Controls & Audio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span>
            카드 <strong className="text-blue-600 text-sm font-bold">{currentIndex + 1}</strong> / {deck.length}
          </span>
          <button
            onClick={() => setFilterHardOnly(!filterHardOnly)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterHardOnly
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${filterHardOnly ? "text-amber-300" : "text-rose-500"}`} />
            취약 카드만 모아보기 ({hardCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              isAudioPlaying
                ? "bg-amber-500 text-white shadow animate-pulse"
                : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
            {isAudioPlaying ? "오디오 정지" : "🎧 핸즈프리 오디오 (TTS)"}
          </button>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
          >
            <Shuffle className="w-3.5 h-3.5" />
            섞기
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="cursor-pointer min-h-[400px] p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group select-none"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {currentItem.subjectName}
            </span>
            <span className="text-xs text-slate-400 font-medium">{currentItem.chapter}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-blue-600 transition-colors">
            <RotateCw className="w-4 h-4" />
            <span>{isFlipped ? "앞면 보기" : "뒤집어 해설 보기"}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="my-auto py-6 text-center space-y-4">
          {!isFlipped ? (
            /* FRONT VIEW */
            <div className="space-y-4 animate-fadeIn">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded-md">
                [핵심 주제]
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {currentItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                {currentItem.summary}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {currentItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* BACK VIEW */
            <div className="space-y-4 text-left animate-fadeIn">
              {currentItem.mnemonic && (
                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm">
                  <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    시험장 3초 암기팁 (두문자)
                  </div>
                  <div className="text-lg font-black text-amber-900 mb-1 tracking-wide">
                    {currentItem.mnemonic.phrase}
                  </div>
                  <div className="text-xs text-amber-800 whitespace-pre-line leading-relaxed font-medium">
                    {currentItem.mnemonic.details}
                  </div>
                </div>
              )}

              {currentItem.formula && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <KatexRenderer latex={currentItem.formula.latex} block />
                  <p className="text-xs text-slate-500 mt-1">{currentItem.formula.description}</p>
                </div>
              )}

              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 text-sm mb-1">상세 해설 & 요약</strong>
                {currentItem.summary}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Mastery Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {currentStatus === "mastered" && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 완벽히 암기함
              </span>
            )}
            {currentStatus === "review" && (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> 헷갈림 (복습 대상)
              </span>
            )}
            {currentStatus === "hard" && (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> 어려움 (집중 암기)
              </span>
            )}
            {!currentStatus && <span>학습 상태를 체크해 보세요</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => setCardMasteryStatus("hard", e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentStatus === "hard"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              어려움
            </button>
            <button
              onClick={(e) => setCardMasteryStatus("review", e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentStatus === "review"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              헷갈림
            </button>
            <button
              onClick={(e) => setCardMasteryStatus("mastered", e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentStatus === "mastered"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
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
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          이전 카드
        </button>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
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
