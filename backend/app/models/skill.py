import uuid
from sqlalchemy import Column, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = Column(String(36), ForeignKey("job_matches.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False)   # Programming, Technical Skills, Frameworks, Databases, Cloud, Tools, Soft Skills, Domain Skills
    skill_name = Column(String(100), nullable=False)
    importance = Column(String(20), nullable=False) # Critical, High, Medium, Low
    why_it_matters = Column(Text, nullable=False)
    suggested_learning_topic = Column(Text, nullable=False)
    equivalent_experience_detected = Column(Boolean, default=False)

    # Relationships
    match = relationship("JobMatch", back_populates="skill_gaps")
