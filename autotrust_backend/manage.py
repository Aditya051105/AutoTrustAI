#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autotrust_backend.settings')
    try:
        from django.core.management import execute_from_command_line
        
        try:
            from django.db.backends.mysql.base import DatabaseWrapper
            original_get_database_version = DatabaseWrapper.get_database_version
            def patched_get_database_version(self):
                return (8, 4, 1)
            DatabaseWrapper.get_database_version = patched_get_database_version
        except Exception:
            pass
            
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
