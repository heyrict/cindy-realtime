# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sui_hei', '%s'),
    ]

    operations = [
        migrations.RenameField(
            model_name='useraward',
            old_name='award_id',
            new_name='award',
        ),
        migrations.RenameField(
            model_name='useraward',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='comment',
            old_name='mondai_id',
            new_name='mondai',
        ),
        migrations.RenameField(
            model_name='comment',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='lobby',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='mondai',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='shitumon',
            old_name='mondai_id',
            new_name='mondai',
        ),
        migrations.RenameField(
            model_name='shitumon',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='star',
            old_name='mondai_id',
            new_name='mondai',
        ),
        migrations.RenameField(
            model_name='star',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='user',
            name='current_award',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='current_award', to='sui_hei.UserAward'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='mondai',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sui_hei.Mondai'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='lobby',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='mondai',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='shitumon',
            name='mondai',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sui_hei.Mondai'),
        ),
        migrations.AlterField(
            model_name='shitumon',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='star',
            name='mondai',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sui_hei.Mondai'),
        ),
        migrations.AlterField(
            model_name='star',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
