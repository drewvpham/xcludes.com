# Generated by Django 2.2.4 on 2020-01-27 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='tickets',
            field=models.IntegerField(default=1000),
        ),
    ]
