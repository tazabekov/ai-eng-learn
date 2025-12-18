"""Seed database with sample tours"""
from sqlmodel import Session
from database import engine, create_db_and_tables
from models import Tour


def seed_database():
    create_db_and_tables()

    tours = [
        Tour(
            name="Парижские Огни",
            description="Незабываемое путешествие в столицу романтики. Эйфелева башня, Лувр, Елисейские поля.",
            destination="Париж, Франция",
            price=89990,
            duration_days=7,
            image_url="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
            available_seats=15
        ),
        Tour(
            name="Токийское Приключение",
            description="Окунитесь в культуру Японии. Храмы, технологии, традиционная кухня.",
            destination="Токио, Япония",
            price=149990,
            duration_days=10,
            image_url="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
            available_seats=12
        ),
        Tour(
            name="Карибский Рай",
            description="Отдых на белоснежных пляжах. Дайвинг, снорклинг и закаты.",
            destination="Барбадос",
            price=119990,
            duration_days=8,
            image_url="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            available_seats=20
        ),
        Tour(
            name="Римские Каникулы",
            description="Вечный город. Колизей, Ватикан, Фонтан Треви и итальянская кухня.",
            destination="Рим, Италия",
            price=69990,
            duration_days=5,
            image_url="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
            available_seats=18
        ),
        Tour(
            name="Сафари в Кении",
            description="Дикая природа Африки. Большая пятерка в естественной среде.",
            destination="Найроби, Кения",
            price=179990,
            duration_days=12,
            image_url="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
            available_seats=10
        ),
        Tour(
            name="Исландские Вулканы",
            description="Земля огня и льда. Водопады, гейзеры, северное сияние.",
            destination="Рейкьявик, Исландия",
            price=109990,
            duration_days=6,
            image_url="https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
            available_seats=14
        ),
    ]

    with Session(engine) as session:
        existing = session.query(Tour).first()
        if existing:
            print("Data already exists")
            return

        for tour in tours:
            session.add(tour)
        session.commit()
        print(f"Created {len(tours)} tours")


if __name__ == "__main__":
    seed_database()
