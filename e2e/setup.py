from create_app import create_app
from models.models import db
from tests.data_models import create_data


def setup_e2e():
    """Sets up the database ahead of e2e tests"""
    test_db_path = "postgresql://postgres:password@localhost:5432/test_sah"
    app = create_app(test_db_path)
    with app.app_context():
        db.drop_all()
        db.create_all()
        create_data(db)

if __name__ == "__main__":
    setup_e2e()
