# Generated by Django 5.0.6 on 2024-06-03 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Career',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('specialization', models.CharField(max_length=100)),
                ('interest', models.CharField(max_length=100)),
                ('skills', models.CharField(max_length=100)),
                ('certification', models.CharField(max_length=100)),
            ],
        ),
    ]