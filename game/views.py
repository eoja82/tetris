from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.checks import messages
from django.db import IntegrityError
from django.db.models import Max, Min
from django.db.models.expressions import F
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.urls.conf import path
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Scores, User

def index(request):
    try:
        leaderboard = Scores.objects.all().order_by("-score")[:10]
    except Scores.DoesNotExist:
        leaderboard = []

    if request.user.is_authenticated:
        try:
            user_scores = Scores.objects.filter(user=request.user).order_by("-score")[:10]
        except Scores.DoesNotExist:
            user_scores = []

        return render(request, "game/index.html", {
        "leaderboard": leaderboard, "user_scores": user_scores
    })

    return render(request, "game/index.html", {
        "leaderboard": leaderboard
    })


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmPassword"]

        # Ensure password matches confirmation
        if password != confirmation:
            return render(request, "game/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "game/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))   
    else:
        return render(request, "game/register.html")


def login_user(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "game/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "game/login.html")


def logout_user(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def score(request):
    if request.method == "POST":
        leaderboard = []
        user_scores = []
        message = ""
        user_high_score = False
        leaderboard_high_score = False
        score = int(json.loads(request.body)["score"])

        if score > 0:
            try:
                user_scores = Scores.objects.filter(user=request.user).order_by("-score")
            except Scores.DoesNotExist:
                pass

            # get current leaderboard before saving any new score    
            try:
                leaderboard = Scores.objects.all().order_by("-score")[:10]
            except Scores.DoesNotExist:
                pass
         
            if user_scores:
                user_count = user_scores.count()
                if user_count < 10 or score > user_scores[len(user_scores) - 1].score:
                    user_high_score = True

                    # delete low score if 10 scores for user in database
                    if user_count >= 10:
                        user_scores[len(user_scores) - 1].delete()

                    # save new score
                    new_score = Scores(user=request.user, score=score)
                    new_score.save()
                
                # get user's scores after saving new score and convert to parsable JSON
                user_scores = [{"user": x.user.username, "score": x.score} for x in Scores.objects.filter(user=request.user).order_by("-score")]

            else:
                user_scores = Scores(user=request.user, score=score)
                user_scores.save()
                # get user's scores after saving new score and convert to parsable JSON
                user_scores = [{"user": x.user.username, "score": x.score} for x in Scores.objects.filter(user=request.user).order_by("-score")]
                user_high_score = True

            # check if score makes the leaderboard
            if leaderboard:
                if leaderboard.count() < 10 or score > leaderboard[len(leaderboard) - 1].score:
                    leaderboard_high_score = True
                # get updated leaderboard and to parsable JSON
                leaderboard = [{"user": x.user.username, "score": x.score} for x in Scores.objects.all().order_by("-score")[:10]]
            else:
                leaderboard_high_score = True
                # get updated leaderboard and to parsable JSON
                leaderboard = [{"user": x.user.username, "score": x.score} for x in Scores.objects.all().order_by("-score")[:10]]

            # send updated scores and message if new high scores
            if user_high_score:
                if user_high_score and leaderboard_high_score:
                    message = "Congratulations, you are on the leaderboard and have new new personal top 10 score!"
                else:
                    message = "Congratulations, you have new new personal top 10 score!"
            
                return JsonResponse({"leaderboard": leaderboard, "user_scores": user_scores, "message": message}, status=201, safe=False)

        else:
            return HttpResponse(status=204)
    else:
        return render(request, "game/index.html")