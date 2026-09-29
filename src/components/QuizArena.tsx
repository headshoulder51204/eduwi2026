"use client";

import React, { useState, useMemo } from "react";
import { StudyItem, Quiz } from "@/types/study";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface QuizArenaProps {
  items: StudyItem[];
}

interface FlatQuiz {
  subjectName: string;
  chapter: string;
  quiz: Quiz;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ items }) => {
  const flatQuizzes: FlatQuiz[] = useMemo(() => {
    const list: FlatQuiz[] = [];
    items.forEach((item) => {
      item.quizzes.forEach((quiz) => {
        list.push({
          subjectName: item.subjectName,
          chapter: item.chapter,
          quiz,
        });
      });
    });
    return list;
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [wrongQuizzes, setWrongQuizzes] = useState<FlatQuiz[]>([]);
  const [showWrongOnly, setShowWrongOnly] = useState(false);

  const activeList = showWrongOnly ? wrongQuizzes : flatQuizzes;
  const current = activeList[currentIndex];

  const handleSelectOX = (val: boolean) => {
    if (showExplanation || !current) return;
    setSelectedAnswer(val);
    setShowExplanation(true);
    setAnsweredCount((prev) => prev + 1);

    const isCorrect = val === current.quiz.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuizzes((prev) => [...prev, current]);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (showExplanation || !current) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setAnsweredCount((prev) => prev + 1);

    const isCorrect = idx === current.quiz.answerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuizzes((prev) => [...prev, current]);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIndex + 1 < activeList.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = (wrongOnly = false) => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredCount(0);
    setShowWrongOnly(wrongOnly);
  };

  if (!current) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-sm space-y-5">
        <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
        <h3 className="text-2xl font-bold text-gray-900">모든 문제를 완료했습니다!</h3>
        <p className="text-sm text-gray-600">
          최종 점수: <strong className="text-blue-600 text-lg">{score}</strong> / {activeList.length}점
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => handleRestart(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> 전체 다시 풀기
          </button>
          {wrongQuizzes.length > 0 && !showWrongOnly && (
            <button
              onClick={() => handleRestart(true)}
              className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-sm transition-all"
            >
              오답 {wrongQuizzes.length}문제만 복습
            </button>
          )}
        </div>
      </div>
    );
  }

  const isCurrentOX = current.quiz.type === "ox";
  const isCorrect =
    isCurrentOX
      ? selectedAnswer === current.quiz.answer
      : selectedAnswer === current.quiz.answerIndex;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Quiz Status Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {current.subjectName}
          </span>
          <span className="text-gray-400">{current.chapter}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            진행도: <strong className="text-blue-600">{currentIndex + 1}</strong> / {activeList.length}
          </span>
          <span>
            현재 점수: <strong className="text-emerald-600">{score}</strong>점
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            Q{currentIndex + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed pt-0.5">
            {current.quiz.question}
          </h3>
        </div>

        {/* Answer Selection: OX Mode */}
        {isCurrentOX ? (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              disabled={showExplanation}
              onClick={() => handleSelectOX(true)}
              className={`p-6 rounded-2xl border-2 font-black text-3xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                showExplanation
                  ? current.quiz.answer === true
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                    : selectedAnswer === true
                    ? "bg-rose-50 border-rose-500 text-rose-600"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                  : "bg-white hover:bg-blue-50/50 border-gray-200 hover:border-blue-400 text-blue-600 shadow-sm hover:shadow"
              }`}
            >
              <span>⭕</span>
              <span className="text-sm font-bold">그렇다 (O)</span>
            </button>

            <button
              disabled={showExplanation}
              onClick={() => handleSelectOX(false)}
              className={`p-6 rounded-2xl border-2 font-black text-3xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                showExplanation
                  ? current.quiz.answer === false
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                    : selectedAnswer === false
                    ? "bg-rose-50 border-rose-500 text-rose-600"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                  : "bg-white hover:bg-rose-50/50 border-gray-200 hover:border-rose-400 text-rose-600 shadow-sm hover:shadow"
              }`}
            >
              <span>❌</span>
              <span className="text-sm font-bold">아니다 (X)</span>
            </button>
          </div>
        ) : (
          /* Multiple Choice 5-Options */
          <div className="space-y-3 pt-2">
            {current.quiz.options?.map((opt, idx) => {
              const isOptionCorrect = idx === current.quiz.answerIndex;
              const isOptionSelected = idx === selectedAnswer;

              return (
                <button
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all flex items-start gap-3 ${
                    showExplanation
                      ? isOptionCorrect
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : isOptionSelected
                        ? "bg-rose-50 border-rose-500 text-rose-800"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                      : "bg-white hover:bg-blue-50/50 border-gray-200 hover:border-blue-400 text-gray-800"
                  }`}
                >
                  <span className="font-bold font-mono text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Explanation & Feedback Card */}
        {showExplanation && (
          <div
            className={`p-5 rounded-2xl border transition-all animate-fadeIn ${
              isCorrect
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                : "bg-rose-50/80 border-rose-200 text-rose-950"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700">정답입니다! 완벽해요.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-rose-700">아쉽네요! 시험 단골 함정입니다.</span>
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed whitespace-pre-line text-gray-800">
              {current.quiz.explanation}
            </p>

            <div className="mt-4 pt-3 border-t border-gray-200/50 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                다음 문제 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
