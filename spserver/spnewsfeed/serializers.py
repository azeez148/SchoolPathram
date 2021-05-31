from rest_framework import serializers
from .models import NewsFeed
class NewsFeedSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsFeed
        fields = ['uuid', 'title', 'description', 'created', 'created_by', 'is_active',]