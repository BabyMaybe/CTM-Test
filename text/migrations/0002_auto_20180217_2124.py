# Generated by Django 2.0.2 on 2018-02-17 21:24

from django.db import migrations, models
import text.models


class Migration(migrations.Migration):

    dependencies = [
        ('text', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdata',
            name='phone',
            field=models.CharField(max_length=11, validators=[text.models.validate_phone]),
        ),
    ]
