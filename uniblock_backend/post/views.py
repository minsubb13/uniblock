from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Post, Vote
from .serializers import PostSerializer, PostCreateSerializer
from .permissions import CustomReadOnly
from user.models import Profile
from .xrpl_utils import get_wallet, cast_vote, tally_votes

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [CustomReadOnly]
    filter_backends = [DjangoFilterBackend]

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return PostSerializer
        return PostCreateSerializer
    
    def perform_create(self, serializer):
        profile = Profile.objects.get(user = self.request.user)
        serializer.save(author = self.request.user, profile = profile)

class VoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk = pk)
        user = request.user
        profile = get_object_or_404(Profile, user = user)
        choice = request.data.get('choice')

        if not choice or choice not in ['O', 'X']:
            return Response({"error": "Valid choice (O or X) is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 이미 투표한 경우 체크
        if Vote.objects.filter(voter=user, post=post).exists():
            return Response({"error": "You have already voted on this post."}, status=status.HTTP_400_BAD_REQUEST)

        wallet = get_wallet()
        try:
            # 블록체인에 투표 기록
            transaction_result = cast_vote(wallet, str(post.pk), "", choice)

            # 데이터베이스에 투표 저장
            vote = Vote.objects.create(
                voter=user,
                profile=profile,
                post=post,
                choice=choice
            )

            # Post 모델의 participation 필드 업데이트
            post.participation.add(user)

            return Response({
                "message": "Vote recorded successfully",
                "transaction_hash": transaction_result['hash']
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class TallyView(APIView):

    def get(self, request, pk):
        post = get_object_or_404(Post, pk = pk)
        wallet = get_wallet()
        try:
            result = tally_votes(wallet, str(post.pk))
            return Response(result, status = status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)