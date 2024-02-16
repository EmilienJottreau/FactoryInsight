from datetime import datetime, timedelta
from database import Database


database = Database("FactoryInsignt", recreate_db=False, logger=True)

print(str(datetime.now() - timedelta(hours=50)))
result = database.select_stat("Tank", "liquid_level", str(datetime.now() - timedelta(hours=10)))
print(len(result))
