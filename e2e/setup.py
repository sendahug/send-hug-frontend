import asyncio

from firebase_admin import initialize_app  # type: ignore
from sqlalchemy import URL

from create_app import create_app
from tests.data_models import create_data
from models.common import BaseModel
from models.db import SendADatabase
from config.config import sah_config

# class SAHConfig:
#     """
#     Configuration class for the Send A Hug backend.
#     """

#     def __init__(self, database_url: str):
#         self.database_url = database_url
#         self.db = SendADatabase(database_url=URL.create(
#                 drivername="postgresql+asyncpg",
#                 username="postgres",
#                 password="password",
#                 host="localhost",
#                 port=5432,
#                 database="sendahug",
#             )
#         )
#         self.firebase_app = initialize_app()


async def setup_e2e():
    """Sets up the database ahead of e2e tests"""
    # test_db_path = "postgresql+asyncpg://postgres:password@localhost:5432/sendahug"
    # test_config = SAHConfig(database_url=test_db_path)
    app = create_app()

    async with sah_config.db.engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.drop_all)
        await conn.run_sync(BaseModel.metadata.create_all)

    await create_data(sah_config.db)


if __name__ == "__main__":
    asyncio.run(setup_e2e())
