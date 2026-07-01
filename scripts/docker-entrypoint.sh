#!/bin/sh
set -e

# Default: persistent SQLite on a mounted volume (Railway / Fly / Docker Compose).
export DATABASE_URL="${DATABASE_URL:-file:/data/prod.db}"

case "$DATABASE_URL" in
  file:*)
    DB_PATH="${DATABASE_URL#file:}"
    ;;
  *)
    echo "This image expects SQLite DATABASE_URL starting with file: (e.g. file:/data/prod.db)."
    exit 1
    ;;
esac

mkdir -p "$(dirname "$DB_PATH")"

if [ ! -f "$DB_PATH" ]; then
  echo "First run: creating database at $DB_PATH"
  npx prisma db push
  npx prisma db seed
else
  npx prisma db push
fi

exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
