from django.apps import AppConfig

class QuestsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quests'

    def ready(self):
        # Import signal handlers
        from . import signals  # noqa: F401