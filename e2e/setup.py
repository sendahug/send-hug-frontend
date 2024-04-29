import asyncio

from create_app import create_app
from config import SAHConfig
from tests.data_models import create_data
from models.models import BaseModel


async def setup_e2e():
    """Sets up the database ahead of e2e tests"""
    test_db_path = "postgresql+asyncpg://postgres:password@localhost:5432/test_sah"
    test_config = SAHConfig(database_url=test_db_path)
    app = create_app(config=test_config)

    async with test_config.db.engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.drop_all)
        await conn.run_sync(BaseModel.metadata.create_all)

    await create_data(test_config.db)


if __name__ == "__main__":
    asyncio.run(setup_e2e())
