"""A small CSV quality check for the course repository's synthetic example."""

from pathlib import Path

import pandas as pd


REQUIRED_COLUMNS = ("date", "symbol", "open", "high", "low", "close", "volume")


def load_monthly_csv(path: str | Path) -> pd.DataFrame:
    """Read a canonical monthly OHLCV CSV and reject basic data errors."""
    frame = pd.read_csv(path)
    missing = set(REQUIRED_COLUMNS) - set(frame.columns)
    if missing:
        raise ValueError(f"Missing columns: {', '.join(sorted(missing))}")
    if frame.empty:
        raise ValueError("The CSV has no observations")

    frame = frame.loc[:, REQUIRED_COLUMNS].copy()
    frame["date"] = pd.to_datetime(frame["date"], format="%Y-%m-%d", errors="raise")
    frame["symbol"] = frame["symbol"].astype("string").str.strip().str.upper()
    for column in ("open", "high", "low", "close", "volume"):
        frame[column] = pd.to_numeric(frame[column], errors="raise")

    if frame.isna().any().any() or frame["symbol"].eq("").any():
        raise ValueError("The CSV contains missing values")
    if (frame[["open", "high", "low", "close"]] <= 0).any().any():
        raise ValueError("Prices must be positive")
    if (frame["volume"] < 0).any():
        raise ValueError("Volume must not be negative")
    if (frame["low"] > frame[["open", "close"]].min(axis=1)).any() or (
        frame["high"] < frame[["open", "close"]].max(axis=1)
    ).any():
        raise ValueError("OHLC values are inconsistent")

    months = frame["date"].dt.to_period("M")
    if frame.assign(month=months).duplicated(["symbol", "month"]).any():
        raise ValueError("Each instrument needs at most one row per month")
    return frame.sort_values(["date", "symbol"]).reset_index(drop=True)
