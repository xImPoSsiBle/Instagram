# Instagram Clone

## Стек
- **Frontend:** React, TypeScript, Redux Toolkit, Tailwind CSS
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy

## Запуск

### Бэкенд
1. Перейди в папку бэкенда
2. Создай виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
3. Установи зависимости
pip install -r requirements.txt
4. Создай `.env` файл по примеру `.env.example`
5. Запусти сервер
uvicorn main:app --reload


### Фронтенд
1. Перейди в папку фронтенда
2. Установи зависимости
npm install
3. Создай `.env` файл по примеру `.env.example`
4. Запусти проект
npm run dev
