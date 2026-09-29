import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPass 2026 | 공인중개사 스마트 수험 웹서비스",
  description:
    "공인중개사 1차/2차 핵심 개념, 두문자 암기팁, 부동산학개론 계산식 마스터 랩, 실전 OX 퀴즈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
        {/* Top Global Navigation */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                E
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                    EduPass 2026
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    공인중개사 합격 패스
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Gemini AI 연동 스마트 암기 & 계산식 마스터 랩
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI 에이전트 동기화 준비 완료
              </span>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                Vercel 배포
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p className="font-semibold text-slate-700">EduPass 2026 · 공인중개사 1차/2차 완전정복</p>
            <p>Designed for Continuous AI Learning & Instant Vercel Deployment</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
