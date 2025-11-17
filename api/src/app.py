from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncIterator

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age


from fastapi import Query
from datetime import datetime, timedelta

@app.get("/quotes")
def get_quotes(max_age: str = Query("all")):
    """
    Retrieve quotes filtered by age.
    max_age options: "week", "month", "year", "all"
    """
    now = datetime.now()

    # timedelta calculates the difference of time automatically
    if max_age == "week":
        cutoff = now - timedelta(weeks=1)
    elif max_age == "month":
        cutoff = now - timedelta(days=30)
    elif max_age == "year":
        cutoff = now - timedelta(days=365)
    else:
        cutoff = None

    result = []
    for quote in database["quotes"]:
        quote_time = datetime.fromisoformat(quote["time"])
        if not cutoff or quote_time >= cutoff:
            result.append(quote)
    return result

