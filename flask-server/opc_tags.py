from datetime import datetime
from typing import Any


class OPC_Tag:
    def __init__(self, name: str, value: Any, timestamp: datetime = "") -> None:
        self.name = name
        self.value = value
        self.timestamp = self.set_timestamp(timestamp)

    def set_timestamp(self, timestamp: datetime) -> datetime:
        if timestamp:
            return timestamp
        else:
            return datetime.now()

    def set_id(self, id: int) -> None:
        self.id = id

    @property
    def json(self) -> dict:
        return {"name": self.name, "value": self.value, "timestamp": str(self.timestamp)[:-7], "id": self.id}

    def __str__(self) -> str:
        return f"{self.name} has a value of {self.value} at {self.timestamp}"
