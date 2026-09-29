"use client";

import React, { useState, useMemo } from "react";
import {
  SUBJECT_METAS,
  ALL_STUDY_ITEMS,
  DAILY_LOGS,
  getItemsBySubject,
} from "@/lib/data";
import { SubjectId, StudyItem } from "@/types/study";
import { FormulaLab } from "@/components/FormulaLab";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { QuizArena } from "@/components/QuizArena";
import { GeminiIngester } from "@/components/GeminiIngester";
import {
  BookOpen,
  Calculator,
  HelpCircle,
  Sparkles,
  Calendar,
  Layers,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";

type TabMode = "flashcards" | "formula" | "quiz" | "ingest" | "timeline";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabMode>("flashcards");
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items by subject and search keyword
  const filteredItems = useMemo(() => {
    let items = getItemsBySubject(selectedSubject);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.chapter.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [selectedSubject, searchQuery]);

  const totalFormulas = useMemo(
    () => ALL_STUDY_ITEMS.filter((i) => i.formula !== undefined).length,
    []
  );

  const totalQuizzes = useMemo(
    () => ALL_STUDY_ITEMS.reduce((acc, cur) => acc + cur.quizzes.length, 0),
    []
  );

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Stats */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> 2026 공인중개사 동차 합격 대비
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              나만의 AI 수험 지식 베이스
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Gemini와 문답한 핵심 개념, 두문자 암기 공식, 그리고 부동산학개론의 까다로운 계산식을
              인터랙티브하게 실습하고 자동 복습하세요.
            </p>
          </div>

          {/* Quick Counter Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                학습 개념
              </span>
              <strong className="text-2xl font-black text-blue-600">
                {ALL_STUDY_ITEMS.length}
              </strong>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                계산 랩
              </span>
              <strong className="text-2xl font-black text-amber-600">
                {totalFormulas}
              </strong>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                기출 퀴즈
              </span>
              <strong className="text-2xl font-black text-emerald-600">
                {totalQuizzes}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl">
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "flashcards"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            두문자 플래시카드
          </button>

          <button
            onClick={() => setActiveTab("formula")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "formula"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            계산식 마스터 랩
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "quiz"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            스피드 OX & 퀴즈
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "timeline"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            오늘의 복습
          </button>

          <button
            onClick={() => setActiveTab("ingest")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ingest"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            노트 입력 프리뷰
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="개념, 키워드, 공식 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Subject Filter Chips (Only for flashcards, formula, quiz) */}
      {activeTab !== "ingest" && activeTab !== "timeline" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSubject === "all"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            전체 과목 ({ALL_STUDY_ITEMS.length})
          </button>

          {SUBJECT_METAS.map((meta) => {
            const count = getItemsBySubject(meta.id).length;
            const isSelected = selectedSubject === meta.id;

            return (
              <button
                key={meta.id}
                onClick={() => setSelectedSubject(meta.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-blue-700 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Tab View */}
      <section className="transition-all animate-fadeIn">
        {activeTab === "flashcards" && <FlashcardDeck items={filteredItems} />}

        {activeTab === "formula" && <FormulaLab items={filteredItems} />}

        {activeTab === "quiz" && <QuizArena items={filteredItems} />}

        {activeTab === "ingest" && <GeminiIngester />}

        {activeTab === "timeline" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                날짜별 학습 기록 및 복습 가이드
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                매일 에이전트에게 전달해주신 내용이 기록되는 타임라인입니다. 시험 전 취약했던 날짜의 개념을
                역순으로 빠르게 복습할 수 있습니다.
              </p>

              <div className="space-y-4 pt-2">
                {DAILY_LOGS.map((log) => (
                  <div
                    key={log.date}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                        📅 {log.date}
                      </span>
                      <span className="text-xs text-blue-600 font-semibold">
                        등록 항목: {log.itemIds.length}개
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{log.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
