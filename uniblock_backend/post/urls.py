from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, VoteView, TallyView

router = DefaultRouter()
router.register(r'', PostViewSet, basename='post')

urlpatterns = [
    path('<int:pk>/vote/', VoteView.as_view(), name='vote-post'),
    path('<int:pk>/tally/', TallyView.as_view(), name='tally-votes'),
]

urlpatterns += router.urls