from .serializers import TaskSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Task
from rest_framework import viewsets
from .actions import syncTasksBasedOnGmailAndCalendarData, createAiSuggestion


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.none()

    @action(detail=False, methods=["post"], url_path="ai_suggestion")
    def getAiSuggestion(self, request):
        title = request.data.get("title")
        description = request.data.get("description")
        aiSuggestion = createAiSuggestion(title=title, description=description)

        if not title or not description:
            return Response({"error": "title and description are required"}, status=400)

        aiSuggestion = createAiSuggestion(title=title, description=description)
        return Response(aiSuggestion)

    @action(detail=False, methods=["post"], url_path="sync_tasks")
    def sync_new_tasks(self, request):
        
        user_id= request.data.get("user_id")
        syncedTasks = syncTasksBasedOnGmailAndCalendarData(userId=user_id)

        if not syncedTasks:
            return Response({"error": "Could not sync Tasks"}, status=400)

        return Response(syncedTasks)

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if user_id:
            return Task.objects.filter(user_id=user_id)
        return Task.objects.all

    serializer_class = TaskSerializer
