# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sui_hei', '%s'),
    ]

    operations = [
        migrations.RenameModel("Mondai", "Puzzle"),
        migrations.RenameModel("Lobby", "Minichat"),
        migrations.RenameModel("Shitumon", "Dialogue"),
        migrations.RenameField(
            model_name='puzzle',
            old_name='kaisetu',
            new_name='solution', ),
        migrations.RenameField(
            model_name='dialogue',
            old_name='kaitou',
            new_name='answer', ),
        migrations.RenameField(
            model_name='dialogue',
            old_name='shitumon',
            new_name='question', ),
        migrations.RenameField(
            model_name='comment',
            old_name='mondai',
            new_name='puzzle', ),
        migrations.RenameField(
            model_name='dialogue',
            old_name='mondai',
            new_name='puzzle', ),
        migrations.RenameField(
            model_name='star',
            old_name='mondai',
            new_name='puzzle', ),
    ]
