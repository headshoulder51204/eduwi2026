"use client";

import React, { useState, useMemo } from "react";
import { StudyItem } from "@/types/study";
import { KatexRenderer } from "./KatexRenderer";
import { Calculator, Sparkles, BookOpen, CheckCircle, ArrowRight, RotateCcw, Dices } from "lucide-react";

interface FormulaLabProps {
  items: StudyItem[];
}

export const FormulaLab: React.FC<FormulaLabProps> = ({ items }) => {
  const formulaItems = useMemo(
    () => items.filter((item) => item.formula !== undefined),
    [items]
  );

  const [selectedId, setSelectedId] = useState<string>(
    formulaItems[0]?.id || ""
  );

  const currentItem = useMemo(
    () => formulaItems.find((item) => item.id === selectedId) || formulaItems[0],
    [formulaItems, selectedId]
  );

  // Variable values state
  const [variableValues, setVariableValues] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      currentItem?.formula?.variables.forEach((v) => {
        initial[v.id] = v.defaultValue;
      });
      return initial;
    }
  );

  // Reset variables when switching items
  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    const item = formulaItems.find((i) => i.id === id);
    if (item?.formula) {
      const nextVals: Record<string, number> = {};
      item.formula.variables.forEach((v) => {
        nextVals[v.id] = v.defaultValue;
      });
      setVariableValues(nextVals);
    }
  };

  const handleInputChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setVariableValues((prev) => ({ ...prev, [id]: num }));
  };

  const resetToDefault = () => {
    if (currentItem?.formula) {
      const resetVals: Record<string, number> = {};
      currentItem.formula.variables.forEach((v) => {
        resetVals[v.id] = v.defaultValue;
      });
      setVariableValues(resetVals);
    }
  };

  const randomizeVariables = () => {
    if (!currentItem?.formula) return;
    const randomVals: Record<string, number> = {};

    switch (currentItem.id) {
      case "intro-001": {
        const pgiOptions = [50000000, 60000000, 80000000, 100000000, 120000000];
        const pgi = pgiOptions[Math.floor(Math.random() * pgiOptions.length)];
        const vacOptions = [5, 10, 15];
        const vacancy = vacOptions[Math.floor(Math.random() * vacOptions.length)];
        const oe = Math.floor((pgi * (0.1 + Math.random() * 0.15)) / 1000000) * 1000000;
        const debt = Math.floor((pgi * (0.15 + Math.random() * 0.15)) / 1000000) * 1000000;
        const tax = Math.floor((pgi * (0.03 + Math.random() * 0.04)) / 1000000) * 1000000;
        randomVals["pgi"] = pgi;
        randomVals["vacancy"] = vacancy;
        randomVals["misc"] = 0;
        randomVals["oe"] = oe;
        randomVals["debt"] = debt;
        randomVals["tax"] = tax;
        break;
      }
      case "intro-005": {
        const success = [800000000, 880000000, 990000000, 1100000000][Math.floor(Math.random() * 4)];
        const fail = [550000000, 660000000, 770000000][Math.floor(Math.random() * 3)];
        const prob = [30, 40, 50, 60][Math.floor(Math.random() * 4)];
        const rate = [5, 8, 10][Math.floor(Math.random() * 3)];
        randomVals["successVal"] = success;
        randomVals["failVal"] = fail;
        randomVals["failProb"] = prob;
        randomVals["discountRate"] = rate;
        break;
      }
      case "intro-009": {
        const popA = 1000;
        const multiplier = [4, 9, 16][Math.floor(Math.random() * 3)];
        const popB = popA * multiplier;
        const dist = (1 + Math.sqrt(multiplier)) * [3, 4, 5][Math.floor(Math.random() * 3)];
        randomVals["popA"] = popA;
        randomVals["popB"] = popB;
        randomVals["totalDist"] = dist;
        break;
      }
      case "intro-012": {
        const total = [200000000, 300000000, 400000000, 500000000][Math.floor(Math.random() * 4)];
        const loanRatio = [0.4, 0.5, 0.6, 0.7][Math.floor(Math.random() * 4)];
        const loan = Math.floor(total * loanRatio);
        const rate = [4, 5, 6, 7][Math.floor(Math.random() * 4)];
        const noi = Math.floor((total * (0.06 + Math.random() * 0.03)) / 1000000) * 1000000;
        const app = [0, 2, 3, 5][Math.floor(Math.random() * 4)];
        randomVals["totalInvest"] = total;
        randomVals["loanAmount"] = loan;
        randomVals["interestRate"] = rate;
        randomVals["noi"] = noi;
        randomVals["appreciationRate"] = app;
        break;
      }
      case "intro-013": {
        const noi = [15000000, 20000000, 25000000][Math.floor(Math.random() * 3)];
        const rf = [3, 4, 5][Math.floor(Math.random() * 3)];
        const rp = [3, 4, 5][Math.floor(Math.random() * 3)];
        const pi = [1, 2, 3][Math.floor(Math.random() * 3)];
        const marketPrice = [200000000, 250000000, 300000000][Math.floor(Math.random() * 3)];
        randomVals["noi"] = noi;
        randomVals["rf"] = rf;
        randomVals["rp"] = rp;
        randomVals["pi"] = pi;
        randomVals["marketPrice"] = marketPrice;
        break;
      }
      case "intro-015": {
        const loans = [50000000, 100000000, 200000000, 300000000];
        const loan = loans[Math.floor(Math.random() * loans.length)];
        const mcList = [0.075, 0.0872, 0.095, 0.102];
        const mc = mcList[Math.floor(Math.random() * mcList.length)];
        const funds = [50000000, 100000000, 200000000];
        const fund = funds[Math.floor(Math.random() * funds.length)];
        const sffList = [0.082, 0.1638, 0.250];
        const sff = sffList[Math.floor(Math.random() * sffList.length)];
        randomVals["loan"] = loan;
        randomVals["mortgageConstant"] = mc;
        randomVals["targetFund"] = fund;
        randomVals["sinkingFundFactor"] = sff;
        break;
      }
      case "intro-017": {
        const loans = [100000000, 150000000, 200000000, 300000000];
        const loan = loans[Math.floor(Math.random() * loans.length)];
        const rates = [4, 5, 6, 7];
        const rate = rates[Math.floor(Math.random() * rates.length)];
        const periods = [10, 15, 20, 25];
        const period = periods[Math.floor(Math.random() * periods.length)];
        const mcList = [0.08024, 0.087, 0.0963, 0.13587];
        const mc = mcList[Math.floor(Math.random() * mcList.length)];
        randomVals["loan"] = loan;
        randomVals["rate"] = rate;
        randomVals["period"] = period;
        randomVals["mortgageConstant"] = mc;
        break;
      }
      case "intro-020": {
        const prices = [300000000, 400000000, 500000000, 600000000];
        const price = prices[Math.floor(Math.random() * prices.length)];
        const ltvs = [50, 60, 70];
        const ltv = ltvs[Math.floor(Math.random() * ltvs.length)];
        const incomes = [40000000, 50000000, 60000000, 70000000];
        const income = incomes[Math.floor(Math.random() * incomes.length)];
        const dtis = [30, 40, 50];
        const dti = dtis[Math.floor(Math.random() * dtis.length)];
        const mcs = [0.08, 0.1, 0.12];
        const mc = mcs[Math.floor(Math.random() * mcs.length)];
        const debts = [0, 50000000, 100000000];
        const existingDebt = debts[Math.floor(Math.random() * debts.length)];
        randomVals["price"] = price;
        randomVals["ltv"] = ltv;
        randomVals["income"] = income;
        randomVals["dti"] = dti;
        randomVals["mortgageConstant"] = mc;
        randomVals["existingDebt"] = existingDebt;
        break;
      }
      default: {
        currentItem.formula.variables.forEach((v) => {
          const factor = 0.8 + Math.random() * 0.4;
          randomVals[v.id] = Math.round(v.defaultValue * factor * 10) / 10;
        });
      }
    }
    setVariableValues(randomVals);
  };

  // Safe calculation execution
  const calculationResult = useMemo(() => {
    if (!currentItem?.formula?.calculateScript) return null;
    try {
      const keys = Object.keys(variableValues);
      const vals = Object.values(variableValues);
      const fn = new Function(...keys, currentItem.formula.calculateScript);
      return fn(...vals);
    } catch (e) {
      console.error("Calculation script error:", e);
      return null;
    }
  }, [currentItem, variableValues]);

  if (!currentItem || !currentItem.formula) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">등록된 계산 공식이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formula Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200">
        {formulaItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectItem(item.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ${
              item.id === currentItem.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            {item.title}
          </button>
        ))}
      </div>

      {/* Main Calculation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Formula Spec & Dynamic Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {currentItem.subjectName} · {currentItem.chapter}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={randomizeVariables}
                className="text-xs px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl flex items-center gap-1 font-bold transition-all shadow-sm"
              >
                <Dices className="w-3.5 h-3.5 text-amber-600" />
                🎲 시험장 변형 숫자 생성
              </button>
              <button
                onClick={resetToDefault}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors px-2 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                기본값
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{currentItem.title}</h3>
            <p className="text-sm text-gray-600">{currentItem.summary}</p>
          </div>

          {/* Formula Latex Display */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              표준 시험 공식 (LaTeX)
            </div>
            <div className="text-center py-2">
              <KatexRenderer latex={currentItem.formula.latex} block />
            </div>
            <p className="text-xs text-slate-600 mt-2 border-t border-slate-200 pt-2">
              💡 {currentItem.formula.description}
            </p>
          </div>

          {/* Interactive Input Form */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              수치 변수 입력 (실시간 계산)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentItem.formula.variables.map((v) => (
                <div key={v.id} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">
                    {v.name}
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      value={variableValues[v.id] ?? 0}
                      onChange={(e) => handleInputChange(v.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white pr-10 font-mono transition-all"
                    />
                    {v.unit && (
                      <span className="absolute right-3 top-2 text-xs text-gray-400 font-medium pointer-events-none">
                        {v.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-time Output & Mnemonic Tip */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calculation Output Card */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Calculator className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                실시간 산출 결과
              </div>

              {calculationResult ? (
                <div className="space-y-3 font-mono">
                  {Object.entries(calculationResult).map(([k, val]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10"
                    >
                      <span className="text-xs text-blue-200 uppercase font-semibold">
                        {k === "elasticity"
                          ? "가격탄력성 (절댓값)"
                          : k === "crossElasticity"
                          ? "교차탄력성 수치"
                          : k === "relation"
                          ? "두 재화의 관계"
                          : k === "diff"
                          ? "가치 격차 (성공 - 실패)"
                          : k === "infoVal"
                          ? "정보의 현재가치"
                          : k === "ratio"
                          ? "인구비 제곱근 (거리비)"
                          : k === "distA"
                          ? "A도시 기준 경계 거리"
                          : k === "distB"
                          ? "B도시 기준 경계 거리"
                          : k === "noi"
                          ? "순영업소득 (NOI)"
                          : k === "egi"
                          ? "유효총소득 (EGI)"
                          : k === "btcf"
                          ? "세전현금흐름 (BTCF)"
                          : k === "atcf"
                          ? "세후현금흐름 (ATCF)"
                          : k === "roe"
                          ? "자기자본수익률 (지분수익률)"
                          : k === "overallReturn"
                          ? "총자본수익률 (종합수익률)"
                          : k === "leverageType"
                          ? "지렛대 효과 (레버리지 판정)"
                          : k === "equity"
                          ? "자기자본 (지분투자액)"
                          : k === "interest"
                          ? "연간 차입이자"
                          : k === "appreciation"
                          ? "부동산 가격상승분"
                          : k === "netIncome"
                          ? "지분수익 (세전)"
                          : k === "requiredReturn"
                          ? "요구수익률 (무·위·인)"
                          : k === "investmentValue"
                          ? "투자가치 (주관적 가치)"
                          : k === "decision"
                          ? "투자 채택/기각 결정"
                          : k === "annualRepayment"
                          ? "연간 원리금 균등상환액 (융자액 × 저당상수)"
                          : k === "annualSaving"
                          ? "매년 적립액 (목표목돈 × 감채기금계수)"
                          : k === "camPayment1"
                          ? "원금균등(CAM) 1회차 원리금상환액"
                          : k === "camPayment2"
                          ? "원금균등(CAM) 2회차 원리금상환액"
                          : k === "interestDrop"
                          ? "원금균등 매기 이자 감액분 (상환원금 × r)"
                          : k === "cpmPayment"
                          ? "원리금균등(CPM) 매기 원리금상환액 (고정)"
                          : k === "cpmPrincipal1"
                          ? "원리금균등(CPM) 1회차 상환 원금"
                          : k === "cpmPrincipal2"
                          ? "원리금균등(CPM) 2회차 상환 원금 (×(1+r))"
                          : k === "diff1"
                          ? "1회차 차액 (CAM 1회차 - CPM 1회차)"
                          : k === "ltvLimit"
                          ? "LTV 기준 대출한도 (주택가격 × LTV)"
                          : k === "dtiLimit"
                          ? "DTI 기준 대출한도 (연허용원리금 ÷ 저당상수)"
                          : k === "maxLoan"
                          ? "통합 최대 대출가능액 (Min)"
                          : k === "additionalLoan"
                          ? "추가 대출가능액 (최대한도 - 기존대출)"
                          : k}
                      </span>
                      <span className="text-base font-bold text-emerald-300">
                        {typeof val === "number"
                          ? k === "elasticity" || k === "crossElasticity" || k === "ratio"
                            ? val.toFixed(2)
                            : k === "roe" || k === "overallReturn" || k === "requiredReturn"
                            ? val.toFixed(2) + " %"
                            : k === "distA" || k === "distB"
                            ? val.toFixed(2) + " km"
                            : Math.round(val).toLocaleString() + " 원"
                          : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-200">변수를 입력하면 계산 결과가 표시됩니다.</p>
              )}

              {currentItem.mnemonic && (
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    시험장 3초 암기팁 (두문자)
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-xs text-amber-100 font-medium whitespace-pre-line leading-relaxed">
                    <strong className="text-amber-300 text-sm block mb-1">
                      {currentItem.mnemonic.phrase}
                    </strong>
                    {currentItem.mnemonic.details}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Quiz Card */}
          {currentItem.quizzes.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <BookOpen className="w-4 h-4 text-blue-600" />
                이 공식과 연계된 단골 기출 지문
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-800 leading-relaxed border border-gray-200">
                {currentItem.quizzes[0].question}
              </div>
              <p className="text-[11px] text-gray-500">
                👉 상단 [스피드 퀴즈 모드]에서 전체 문제를 풀어볼 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
