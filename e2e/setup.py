import asyncio

from firebase_admin import initialize_app  # type: ignore

from create_app import create_app
from tests.data_models import create_data
from models.common import BaseModel
from models.db import SendADatabase

class SAHConfig:
    """
    Configuration class for the Send A Hug backend.
    """

    def __init__(self, database_url: str):
        self.database_url = database_url
        self.db = SendADatabase(database_url=database_url)
        self.firebase_app = initialize_app()


async def setup_e2e():
    """Sets up the database ahead of e2e tests"""
    test_db_path = "postgresql+asyncpg://postgres:password@localhost:5432/sendahug"
    test_config = SAHConfig(database_url=test_db_path)
    app = create_app(config=test_config)

    async with test_config.db.engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.drop_all)
        await conn.run_sync(BaseModel.metadata.create_all)

    await create_data(test_config.db)


if __name__ == "__main__":
    asyncio.run(setup_e2e())
