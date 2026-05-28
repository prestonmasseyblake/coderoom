import os
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

# Connection string, e.g.:
#   postgresql+psycopg://dbadmin:<password>@<rds-endpoint>:5432/appdb
# The password lives in AWS Secrets Manager (see infra/main.tf: manage_master_user_password).
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Example: "
        "postgresql+psycopg://dbadmin:<password>@<rds-endpoint>:5432/appdb"
    )

# pool_pre_ping checks a connection is alive before use, avoiding errors from
# connections that RDS dropped after an idle timeout.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class CodingSession(Base):
    __tablename__ = "sessions"

    session_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    edit_token: Mapped[str] = mapped_column(String(36), nullable=False)
    language: Mapped[str] = mapped_column(String(32), default="python")
    current_content: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )


def init_db() -> None:
    """Create tables that don't exist yet. Fine for a small app; swap to Alembic later."""
    Base.metadata.create_all(engine)
