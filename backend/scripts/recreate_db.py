"""
Script to recreate database tables with updated schema.
"""

import os
os.environ['PYTHONPATH'] = '.'

from src.database import get_engine, create_db_and_tables
from sqlmodel import SQLModel

def main():
    print("Getting database engine...")
    engine = get_engine()
    
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("Tables dropped")
    
    print("\nCreating new tables...")
    create_db_and_tables()
    print("Tables created successfully!")
    
    print("\nDatabase is ready!")

if __name__ == "__main__":
    main()
