# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_application', '0002_buginfo_bug_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='buginfo',
            name='bug_content_type',
            field=models.CharField(default=b'', max_length=100),
        ),
        migrations.AddField(
            model_name='buginfo',
            name='customer',
            field=models.CharField(default=b'', max_length=100),
        ),
    ]
