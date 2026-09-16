from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import api_router
from app.core.config import settings
from app.core.logging import configure_logging, logger

configure_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, (StarletteHTTPException, RequestValidationError)):
        raise exc
    logger.exception("Unhandled error on %s", request.url.path)
    detail = str(exc) if settings.DEBUG else "Internal server error"
    return JSONResponse(status_code=500, content={"detail": detail})


@app.get("/")
def root():
    return {
        "message": "Welcome to Price Comparator API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "openapi": f"{settings.API_V1_STR}/openapi.json",
    }
