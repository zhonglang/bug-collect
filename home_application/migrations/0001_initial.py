# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BugInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('bug_type', models.CharField(default=b'', max_length=10)),
                ('bug_state', models.CharField(default=b'', max_length=10)),
                ('bug_content', models.TextField(default=b'')),
                ('bug_resolvent', models.TextField(default=b'')),
                ('when_create', models.CharField(default=b'', max_length=30)),
                ('create_by', models.CharField(default=b'', max_length=30)),
            ],
        ),
    ]
