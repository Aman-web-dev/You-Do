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
        title = request.data.get("title", "").strip()
        description = request.data.get("description", "").strip()

        if not title:
            return Response(
                {"error": "title is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Allow empty description if needed, or handle default inside createAiSuggestion
        try:
            aiSuggestion = createAiSuggestion(title=title, description=description)
            return Response(aiSuggestion, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], url_path="sync_tasks")
    def sync_new_tasks(self, request):
        user_id = request.data.get("user_id")
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
