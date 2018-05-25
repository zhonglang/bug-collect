# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_application', '0003_auto_20170726_1844'),
    ]

    operations = [
        migrations.AlterField(
            model_name='buginfo',
            name='bug_content_type',
            field=models.TextField(default=b''),
        ),
    ]
