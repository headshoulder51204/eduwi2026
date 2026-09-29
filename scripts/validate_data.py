"""Data validation script for EduPass 2026 Real Estate Exam content.

Ensures all subjects, chapters, formulas, mnemonics, and quizzes adhere
to the strict schema required by the front-end application.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, List, Literal, Optional
from pydantic import BaseModel, Field, ValidationError
from rich.console import Console
from rich.table import Table

console = Console()

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
SUBJECTS_DIR = DATA_DIR / "subjects"


class FormulaVariable(BaseModel):
    id: str
    name: str
    unit: str = ""
    defaultValue: float


class Formula(BaseModel):
    latex: str
    description: str
    variables: List[FormulaVariable] = Field(default_factory=list)
    calculateScript: Optional[str] = None


class Mnemonic(BaseModel):
    phrase: str
    details: str


class Quiz(BaseModel):
    id: str
    type: Literal["ox", "multiple_choice"]
    question: str
    answer: Optional[bool] = None
    options: Optional[List[str]] = None
    answerIndex: Optional[int] = None
    explanation: str


class StudyItem(BaseModel):
    id: str
    subjectId: str
    subjectName: str
    chapter: str
    type: Literal["concept", "formula", "mnemonic", "quiz"]
    title: str
    tags: List[str] = Field(default_factory=list)
    summary: str
    mnemonic: Optional[Mnemonic] = None
    formula: Optional[Formula] = None
    quizzes: List[Quiz] = Field(default_factory=list)
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class DailyLog(BaseModel):
    date: str
    itemIds: List[str]
    notes: Optional[str] = None


def validate_all() -> bool:
    """Validates all JSON files in the subjects directory and daily logs."""
    all_valid = True
    table = Table(title="[bold green]EduPass 2026 수험 데이터 검증 결과[/bold green]")
    table.add_column("과목 파일", style="cyan")
    table.add_column("항목 수", style="magenta")
    table.add_column("공식 수", style="yellow")
    table.add_column("퀴즈 수", style="blue")
    table.add_column("상태", style="green")

    if not SUBJECTS_DIR.exists():
        console.print(f"[bold red]오류: {SUBJECTS_DIR} 디렉토리가 없습니다.[/bold red]")
        return False

    json_files = sorted(SUBJECTS_DIR.glob("*.json"))
    if not json_files:
        console.print("[bold yellow]주의: 아직 등록된 과목 JSON 파일이 없습니다.[/bold yellow]")
        return True

    total_items = 0
    total_formulas = 0
    total_quizzes = 0

    for file_path in json_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            if not isinstance(raw_data, list):
                table.add_row(file_path.name, "-", "-", "-", "[bold red]FAIL (최상위는 배열이어야 함)[/bold red]")
                all_valid = False
                continue

            item_count = len(raw_data)
            formula_count = 0
            quiz_count = 0

            for index, raw_item in enumerate(raw_data):
                item = StudyItem.model_validate(raw_item)
                if item.formula:
                    formula_count += 1
                quiz_count += len(item.quizzes)

            total_items += item_count
            total_formulas += formula_count
            total_quizzes += quiz_count

            table.add_row(
                file_path.name,
                str(item_count),
                str(formula_count),
                str(quiz_count),
                "[bold green]OK[/bold green]",
            )

        except ValidationError as e:
            all_valid = False
            table.add_row(
                file_path.name,
                "-",
                "-",
                "-",
                f"[bold red]FAIL (Validation Error: {e.error_count()}건)[/bold red]",
            )
            console.print(f"[red]{file_path.name} 검증 실패 세부사항:[/red]")
            console.print(e)
        except Exception as e:
            all_valid = False
            table.add_row(file_path.name, "-", "-", "-", f"[bold red]FAIL ({str(e)})[/bold red]")

    console.print(table)
    console.print(f"총 항목: [bold]{total_items}[/bold]개 | 총 공식: [bold]{total_formulas}[/bold]개 | 총 문제: [bold]{total_quizzes}[/bold]개")
    return all_valid


if __name__ == "__main__":
    import sys
    success = validate_all()
    sys.exit(0 if success else 1)
