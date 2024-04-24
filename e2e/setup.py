from create_app import create_app
from config import SAHConfig
from tests.data_models import create_data
from models.models import BaseModel


def setup_e2e():
    """Sets up the database ahead of e2e tests"""
    test_db_path = "postgresql://postgres:password@localhost:5432/test_sah"
    test_config = SAHConfig(database_url=test_db_path)
    app = create_app(config=test_config)
    with app.app_context():
        BaseModel.metadata.drop_all(test_config.db.engine)
        # create all tables
        BaseModel.metadata.create_all(test_config.db.engine)
        create_data(test_config.db)

if __name__ == "__main__":
    setup_e2e()
