from pathlib import Path

import pandas as pd
import pytest

from src.data_intake import load_monthly_csv


FIXTURE = Path(__file__).parent / "fixtures" / "synthetic_monthly_prices.csv"


def test_synthetic_monthly_file_loads() -> None:
    frame = load_monthly_csv(FIXTURE)
    assert len(frame) == 6
    assert frame["symbol"].unique().tolist() == ["SPY", "TLT"]


def test_duplicate_asset_month_is_rejected(tmp_path: Path) -> None:
    frame = pd.read_csv(FIXTURE)
    pd.concat([frame, frame.iloc[[0]]]).to_csv(tmp_path / "duplicate.csv", index=False)
    with pytest.raises(ValueError, match="one row per month"):
        load_monthly_csv(tmp_path / "duplicate.csv")


def test_missing_required_column_is_rejected(tmp_path: Path) -> None:
    pd.read_csv(FIXTURE).drop(columns="volume").to_csv(tmp_path / "missing.csv", index=False)
    with pytest.raises(ValueError, match="Missing columns"):
        load_monthly_csv(tmp_path / "missing.csv")
