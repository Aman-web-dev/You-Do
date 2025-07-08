from django.db import models
import uuid


# Create your models here.


class CategoryChoices(models.TextChoices):
    WORK = "WORK", "Work"
    PERSONAL = "PERSONAL", "Personal"
    OTHERS = "OTHERS", "Others"


class PriorityChoices(models.IntegerChoices):
    LOW = 1, "Low"
    MEDIUM = 2, "Medium"
    HIGH = 3, "High"


class StatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pending"
    COMPLETED = "COMPLETED", "Completed"
    IN_PROGRESS = "IN_PROGRESS", "In_Progress"


class Task(models.Model):
    user_id=models.CharField(max_length=36,default="00000000-0000-0000-0000-000000000000") 
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CategoryChoices.choices)
    priority_score = models.IntegerField(
        choices=PriorityChoices.choices, default=PriorityChoices.MEDIUM
    )
    deadline = models.DateTimeField()
    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class GoogleOAuth(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=36,default="00000000-0000-0000-0000-000000000000") 
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)
    scope = models.TextField(null=True, blank=True)
    token_type = models.TextField(null=True, blank=True)
    expires_in = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'google_oauth'

def __str__(self):
    return self.title
