version: "3.9"

services:
  equorn:
    build: .
    ports:
      - "3000:3000"
    env_file: .env           # ← define DB creds & app secrets here
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: equorn
      POSTGRES_PASSWORD: equorn
      POSTGRES_DB: equorn
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
