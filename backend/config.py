from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    cerebras_api_key: str = "YOUR_CEREBRAS_API_KEY"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
