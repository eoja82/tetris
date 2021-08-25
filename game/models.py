from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE


class User(AbstractUser):
    pass

class Scores(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    score = models.IntegerField()