from datetime import datetime, timedelta
from database import Database


database = Database("FactoryInsignt", recreate_db=False, logger=True)

duration_storage = {}

def get_average(station: str, tag: str, last_hours: int) -> tuple[float, float, float]:
    results = database.select_stat(station, tag, str(datetime.now() - timedelta(hours=last_hours)))
    values = []
    for result in results:
        values.append(result["value"])
    return max(values), min(values), sum(values) / len(values)


def get_duration(station: str, tag: str, last_hours: int) -> str:
    return str(datetime.now() - duration_storage[station + "_" + tag])

print(get_average("Tank", "liquid_level", 24))
print(get_duration("Tank", "liquid_level", 25))