"""Incremental Study Note Ingestion & Diff Tool for EduPass 2026.

This script detects newly added content from Gemini study note markdown files
by comparing against existing curriculum items and tracking ingestion history.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Dict, List, Set
from rich.console import Console
from rich.table import Table

console = Console()

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
SUBJECTS_DIR = DATA_DIR / "subjects"
LEDGER_FILE = DATA_DIR / ".ingested_sources.json"


def load_existing_titles() -> Set[str]:
    """Loads all existing study item titles to prevent duplicates."""
    titles = set()
    if not SUBJECTS_DIR.exists():
        return titles

    for f in SUBJECTS_DIR.glob("*.json"):
        try:
            with open(f, "r", encoding="utf-8") as fp:
                items = json.load(fp)
                for item in items:
                    title = item.get("title", "").strip().lower()
                    if title:
                        titles.add(title)
        except Exception:
            pass
    return titles


def load_ledger() -> Dict[str, dict]:
    """Loads history of processed files and checkpoints."""
    if not LEDGER_FILE.exists():
        return {}
    try:
        with open(LEDGER_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_ledger(ledger: Dict[str, dict]) -> None:
    """Saves history of processed files."""
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(ledger, f, ensure_ascii=False, indent=2)


def scan_file_sections(file_path: Path) -> List[dict]:
    """Splits markdown notes into logical study sections based on headings or prompts."""
    content = file_path.read_text(encoding="utf-8")
    lines = content.splitlines()

    sections = []
    current_title = "개요"
    current_lines: List[str] = []

    for line in lines:
        prompt_match = re.match(r"^\*User prompt:\s*(.+?)\*?$", line.strip())
        heading_match = re.match(r"^#{1,3}\s+(.+)$", line.strip())

        if prompt_match:
            if current_lines:
                sections.append({
                    "title": current_title,
                    "content": "\n".join(current_lines).strip(),
                    "line_count": len(current_lines),
                })
                current_lines = []
            current_title = prompt_match.group(1).strip()
        elif heading_match and not current_lines:
            current_title = heading_match.group(1).strip()

        current_lines.append(line)

    if current_lines:
        sections.append({
            "title": current_title,
            "content": "\n".join(current_lines).strip(),
            "line_count": len(current_lines),
        })

    return sections


def inspect_delta(file_path: Path) -> List[dict]:
    """Compares file sections against existing knowledge base and ledger."""
    file_path = file_path.resolve()
    if not file_path.exists():
        console.print(f"[bold red]파일을 찾을 수 없습니다: {file_path}[/bold red]")
        return []

    sections = scan_file_sections(file_path)
    existing_titles = load_existing_titles()
    ledger = load_ledger()

    file_key = str(file_path)
    previous_record = ledger.get(file_key, {})
    prev_line_count = previous_record.get("line_count", 0)

    total_lines = len(file_path.read_text(encoding="utf-8").splitlines())

    table = Table(title=f"[bold cyan]증분 분석 결과: {file_path.name}[/bold cyan]")
    table.add_column("섹션 / 주제", style="cyan")
    table.add_column("상태", style="bold")
    table.add_column("비고", style="yellow")

    new_sections = []

    for sec in sections:
        title = sec["title"]
        title_lower = title.lower()

        # Check if already in knowledge base
        is_existing = any(
            t in title_lower or title_lower in t
            for t in existing_titles
        )

        if is_existing:
            table.add_row(title, "[green]기반영됨 (Skipped)[/green]", "이미 데이터셋에 등록됨")
        else:
            table.add_row(title, "[bold yellow]신규 항목 (NEW Delta)[/bold yellow]", "데이터셋 반영 대상")
            new_sections.append(sec)

    console.print(table)
    console.print(f"전체 라인: {total_lines}줄 (이전: {prev_line_count}줄) | 신규 추가 섹션: [bold yellow]{len(new_sections)}[/bold yellow]건")

    return new_sections


def record_processed(file_path: Path) -> None:
    """Updates the ingestion ledger after changes are integrated."""
    file_path = file_path.resolve()
    content = file_path.read_text(encoding="utf-8")
    lines = content.splitlines()

    ledger = load_ledger()
    ledger[str(file_path)] = {
        "line_count": len(lines),
        "hash": hashlib.md5(content.encode("utf-8")).hexdigest(),
        "last_processed": Path(__file__).stat().st_mtime,
    }
    save_ledger(ledger)
    console.print("[dim]증분 처리 원장(.ingested_sources.json)이 업데이트되었습니다.[/dim]")


def main() -> None:
    parser = argparse.ArgumentParser(description="Incremental Study Note Ingestion Tool")
    parser.add_argument("file", help="Path to markdown study notes file")
    parser.add_argument("--record", action="store_true", help="Record file as processed in ledger")
    args = parser.parse_args()

    target_path = Path(args.file)
    new_sections = inspect_delta(target_path)

    if args.record:
        record_processed(target_path)


if __name__ == "__main__":
    main()
