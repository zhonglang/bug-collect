# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_application', '0005_person'),
    ]

    operations = [
        migrations.CreateModel(
            name='Server',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_id', models.CharField(default=b'', max_length=100)),
                ('app', models.CharField(default=b'', max_length=100)),
                ('hostname', models.CharField(default=b'', max_length=50)),
                ('os_name', models.CharField(default=b'', max_length=100)),
                ('ip', models.CharField(default=b'', max_length=100)),
                ('memory', models.CharField(default=b'', max_length=100)),
            ],
        ),
        migrations.DeleteModel(
            name='Person',
        ),
    ]
