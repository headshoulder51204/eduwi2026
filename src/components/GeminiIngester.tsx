"use client";

import React, { useState } from "react";
import { Sparkles, Send, Copy, Check, FileText, ArrowRight, Brain } from "lucide-react";

export const GeminiIngester: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewResult, setPreviewResult] = useState<{
    detectedSubject: string;
    detectedType: string;
    extractedKeywords: string[];
    suggestedTitle: string;
  } | null>(null);

  const samplePrompt = `Gemini에게 물어본 내용:
부동산학개론에서 균형가격과 균형거래량 계산하는 문제가 시험에 너무 자주 나오는데 쉽게 푸는 법 알려줘.
예를 들어 수요함수 Qd = 800 - 2P 이고 공급함수 Qs = 200 + 4P 일 때 균형가격은?
답변:
균형 상태에서는 수요량(Qd)과 공급량(Qs)이 일치하므로 Qd = Qs 식을 세웁니다.
800 - 2P = 200 + 4P
600 = 6P -> P(균형가격) = 100
P=100을 아무 식에 대입하면 Q(균형거래량) = 800 - 200 = 600.
암기 팁: 무조건 Qd와 Qs를 같다고 놓고 P를 좌변이나 우변으로 모아 1차 방정식으로 풀면 10초 컷!`;

  const handleAnalyze = () => {
    if (!inputText.trim()) return;

    let detectedSubject = "부동산학개론";
    let detectedType = "formula";

    if (inputText.includes("민법") || inputText.includes("취득시효") || inputText.includes("허위표시") || inputText.includes("선의")) {
      detectedSubject = "민법 및 민사특별법";
      detectedType = "concept";
    } else if (inputText.includes("중개") || inputText.includes("등록취소") || inputText.includes("과태료")) {
      detectedSubject = "공인중개사법령 및 실무";
      detectedType = "mnemonic";
    } else if (inputText.includes("건폐율") || inputText.includes("용적률") || inputText.includes("국토계획법")) {
      detectedSubject = "부동산공법";
      detectedType = "mnemonic";
    } else if (inputText.includes("양도") || inputText.includes("취득세") || inputText.includes("필요경비")) {
      detectedSubject = "부동산세법";
      detectedType = "concept";
    }

    const lines = inputText.split("\n").filter((l) => l.trim().length > 0);
    const suggestedTitle = lines[0]?.substring(0, 35) || "학습 핵심 포인트";

    setPreviewResult({
      detectedSubject,
      detectedType,
      extractedKeywords: ["균형가격", "수요함수", "공급함수", "1차방정식", "단골계산"],
      suggestedTitle,
    });
  };

  const handleCopyForAgent = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInputText(samplePrompt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-100">
          <Brain className="w-4 h-4 text-amber-300" />
          스마트 텍스트 인제스터 (Gemini 질의응답 처리기)
        </div>
        <h2 className="text-xl font-bold">
          Gemini와 나눈 대화를 여기에 붙여넣어 보세요!
        </h2>
        <p className="text-xs text-blue-100 leading-relaxed">
          형식을 맞출 필요가 전혀 없습니다. 공부하다가 얻은 지문, 계산식, 두문자 암기 팁을 자유롭게 붙여넣으시면,
          에이전트가 과목 분류, 공식 변환, OX 퀴즈 제작까지 100% 자동 처리합니다.
        </p>
        <button
          onClick={loadSample}
          className="text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 샘플 텍스트 불러오기
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <label className="text-xs font-bold text-gray-700 block">
          Gemini 질의응답 원문 또는 일일 학습 메모
        </label>
        <textarea
          rows={7}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="예시: 민법 제108조 통정허위표시 판례를 물어봤는데, 선의의 제3자는 과실 유무를 묻지 않고 보호된다고 합니다..."
          className="w-full p-4 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> AI 구조화 사전 분석
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyForAgent}
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "복사 완료!" : "채팅창 전달용 복사"}
            </button>
          </div>
        </div>

        {/* Real-time Agent Pipeline Preview */}
        {previewResult && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fadeIn">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              에이전트 파이프라인 자동 추출 결과 프리뷰
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">판별된 과목</span>
                <strong className="text-blue-600 font-bold">{previewResult.detectedSubject}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">콘텐츠 유형</span>
                <strong className="text-purple-600 font-bold uppercase">{previewResult.detectedType}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px]">예상 타이틀</span>
                <strong className="text-gray-800 truncate block">{previewResult.suggestedTitle}</strong>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 leading-relaxed">
              💡 <strong>Antigravity 실시간 연동:</strong> 이 내용을 Antigravity 채팅창에 전송하시면, 즉시 과목 JSON 파일에 자동 반영되고 Vercel 배포가 트리거됩니다!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
