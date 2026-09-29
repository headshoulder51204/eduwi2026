import { StudyItem, DailyLog, SubjectMeta } from "@/types/study";
import introData from "../../data/subjects/01_intro.json";
import civilData from "../../data/subjects/02_civil_law.json";
import brokerData from "../../data/subjects/03_broker_law.json";
import publicData from "../../data/subjects/04_public_law.json";
import disclosureData from "../../data/subjects/05_disclosure.json";
import taxData from "../../data/subjects/06_tax_law.json";
import dailyLogsData from "../../data/daily_logs.json";

export const SUBJECT_METAS: SubjectMeta[] = [
  {
    id: "intro",
    name: "부동산학개론",
    tier: "1차",
    icon: "📈",
    color: "from-blue-600 to-indigo-700",
    description: "경제론, 투자론, 금융론, 감정평가론 및 필수 계산식",
  },
  {
    id: "civil_law",
    name: "민법 및 민사특별법",
    tier: "1차",
    icon: "⚖️",
    color: "from-purple-600 to-pink-700",
    description: "민법총칙, 물권법, 계약법, 민사특별법 판례 및 법리",
  },
  {
    id: "broker_law",
    name: "공인중개사법령 및 실무",
    tier: "2차",
    icon: "📜",
    color: "from-emerald-600 to-teal-700",
    description: "중개실무, 행정형벌/행정처분, 중개보수, 두문자 암기",
  },
  {
    id: "public_law",
    name: "부동산공법",
    tier: "2차",
    icon: "🏗️",
    color: "from-amber-600 to-orange-700",
    description: "국토계획법, 도시개발/정비법, 주택/건축/농지법 체계도",
  },
  {
    id: "disclosure_law",
    name: "부동산공시법",
    tier: "2차",
    icon: "🗺️",
    color: "from-cyan-600 to-blue-700",
    description: "공간정보법(지적법) 및 부동산등기법 절차와 효력",
  },
  {
    id: "tax_law",
    name: "부동산세법",
    tier: "2차",
    icon: "💰",
    color: "from-rose-600 to-red-700",
    description: "취득세, 재산세, 종합부동산세, 양도소득세 세율 및 세액계산",
  },
];

export const ALL_STUDY_ITEMS: StudyItem[] = [
  ...(introData as StudyItem[]),
  ...(civilData as StudyItem[]),
  ...(brokerData as StudyItem[]),
  ...(publicData as StudyItem[]),
  ...(disclosureData as StudyItem[]),
  ...(taxData as StudyItem[]),
];

export const DAILY_LOGS: DailyLog[] = dailyLogsData as DailyLog[];

export function getItemsBySubject(subjectId: string): StudyItem[] {
  if (subjectId === "all") return ALL_STUDY_ITEMS;
  return ALL_STUDY_ITEMS.filter((item) => item.subjectId === subjectId);
}

export function getFormulaItems(): StudyItem[] {
  return ALL_STUDY_ITEMS.filter((item) => item.formula !== undefined);
}

export function getAllQuizzes() {
  const list: { item: StudyItem; quiz: StudyItem["quizzes"][0] }[] = [];
  ALL_STUDY_ITEMS.forEach((item) => {
    item.quizzes.forEach((quiz) => {
      list.push({ item, quiz });
    });
  });
  return list;
}
