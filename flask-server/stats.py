from datetime import datetime, timedelta
from database import Database


database = Database("FactoryInsignt", recreate_db=False, logger=True)

def get_average(station: str, tag: str, last_hours: int) -> float:
    results = database.select_stat(station, tag, str(datetime.now() - timedelta(hours=last_hours)))
    values = []
    for result in results:
        values.append(result["value"])
    print(values)


get_average("Tank", "liquid_level", 20)