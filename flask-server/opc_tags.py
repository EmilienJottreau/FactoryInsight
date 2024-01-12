from datetime import datetime
from typing import Any


class OPC_Tag:
    def __init__(self, name: str, value: Any, quality: int = 0, timestamp: datetime = "") -> None:
        self.name = name
        self.value = value
        self.quality = quality
        self.timestamp = self.set_timestamp(timestamp)

    def set_timestamp(self, timestamp: datetime) -> datetime:
        if timestamp:
            return timestamp
        else:
            return datetime.now()

    @property
    def json(self) -> dict:
        return {"name": self.name, "value": self.value, "quality": self.quality, "timestamp": str(self.timestamp)[:-7]}

    def __str__(self) -> str:
        return f"{self.name} has a value of {self.value} at {self.timestamp}"
