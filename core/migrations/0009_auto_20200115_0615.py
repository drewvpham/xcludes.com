# Generated by Django 2.2.4 on 2020-01-15 06:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0008_userprofile_tokens'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='entry',
            name='email',
        ),
        migrations.RemoveField(
            model_name='entry',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='entry',
            name='last_name',
        ),
        migrations.AddField(
            model_name='entry',
            name='user',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
