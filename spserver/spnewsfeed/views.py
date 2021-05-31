from rest_framework.response import Response
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
import json
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import get_user_model
from django.http import QueryDict

from spnewsfeed.serializers import NewsFeedSerializer
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_404_NOT_FOUND
from rest_framework.permissions import AllowAny, IsAuthenticated

from spusers.models import User
from spusers.settings import PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, LOCAL_OAUTH2_KEY
import requests as makerequest

from .models import NewsFeed


class NewsFeedView(APIView):
    """
    An API endpoint for user registration.
    POST must contain 'username', 'email', 'first_name', 'last_name' and 'password' fields.
    """
    permission_classes = (IsAuthenticated, )
    authentication_classes = (TokenAuthentication, )

    def post(self, request):

        # newsfeed_obj = NewsFeed(title=request.data['title'], description=request.data['description'], is_active=True, created_by=user)
        # newsfeed_obj_dict = newsfeed_obj.__dict__

        print (request.data)
        user = User.objects.get(unique_id=request.data['created_by'])

        ordinary_dict = {'created_by': user.id, 'title': request.data['title'],  'description': request.data['description'] }
        query_dict = QueryDict('', mutable=True)
        query_dict.update(ordinary_dict)
        

        # print (newsfeed_obj_dict)
        serializer = NewsFeedSerializer(
            data=query_dict, context={'request': request})

        # Return a 400 response if the data was invalid.
        serializer.is_valid()
        if not serializer.is_valid():
            if serializer.errors:
                error_message = ''
                error_field = ''
                # email_val_error = serializer.errors.get('email')
                # username_val_error = serializer.errors.get('username')
                # password_val_error = serializer.errors.get('password')
                # result = {'success': False, 'type': 'validation'}

                # if email_val_error:
                #     error_message = email_val_error[0]
                #     error_field = 'email'
                #     result['err_field'] = error_field
                #     result['message'] = error_message
                #     return HttpResponse(json.dumps(result, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_400_BAD_REQUEST)
                
                # if username_val_error:
                #     error_message = username_val_error[0]
                #     error_field = 'username'
                #     result['err_field'] = error_field
                #     result['message'] = error_message
                #     return HttpResponse(json.dumps(result, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_400_BAD_REQUEST)

                # if password_val_error:
                #     error_message = password_val_error[0]
                #     error_field = 'password'
                #     result['err_field'] = error_field
                #     result['message'] = error_message
                #     return HttpResponse(json.dumps(result, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_400_BAD_REQUEST)

            responseObj = { 'data': serializer.errors, 'success': False }
            return HttpResponse(json.dumps(responseObj, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        print (validated_data)

        newsfeed = NewsFeed.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            is_active=True,
            created_by=validated_data['created_by']
        )
        newsfeed.save()

        newsfeedObj = {
            "title": newsfeed.title,
            "description": newsfeed.description,
            "created_by": newsfeed.created_by.first_name,
            "is_active": newsfeed.is_active
        }
        dataobj = {
            'data': newsfeedObj,
            'success': True
        }

        return HttpResponse(json.dumps(dataobj, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_201_CREATED)

class NewsFeedListView(APIView):
    """
    Endpoint for user list.
    """
    permission_classes = (IsAuthenticated, )
    authentication_classes = (TokenAuthentication, )
    serializer_class = NewsFeedSerializer

    def get(self, request):
        queryset = NewsFeed.objects.all()
        serializer = self.serializer_class(queryset, many=True)

        newsfeed_list = []
        for newsfeed in serializer.data:
            user = User.objects.get(id=newsfeed['created_by'])

            newsfeedObj = {
                "title": newsfeed['title'],
                "description": newsfeed['description'],
                "created_by": user.first_name,
                "is_active": newsfeed['is_active'],
                "id": newsfeed['uuid']
            }
            newsfeed_list.append(newsfeedObj)

        data_obj = {
            'data': newsfeed_list,
            'success': True
        }
        return HttpResponse(json.dumps(data_obj, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_200_OK)

# class UserLoginAPIView(APIView):
#     """
#     Endpoint for user login. Returns authentication token on success.
#     """

#     permission_classes = (AllowAny,)
#     serializer_class = UserLoginSerializer
#     user_class = get_user_model()


#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid()

#         if not serializer.is_valid():
#             result = {'success': False, 'type': 'login'}
#             result['message'] = 'Login failed, Please check the credentials.'
#             result['err_field'] = None
#             return HttpResponse(json.dumps(result, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_400_BAD_REQUEST)

#         user = serializer.validated_data['user_obj']
#         user_serializer = UserSerializer(user)
#         print (user)

#         data_obj = {
#             'token': serializer.data['token'],
#             'data': user_serializer.data,
#             'success': True
#             }
#         return HttpResponse(json.dumps(data_obj, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_200_OK)


# class UserProfileAPIView(generics.RetrieveAPIView):
#     """
#     Endpoint to retrieve user profile.
#     """

#     permission_classes = (IsAuthenticated, )
#     authentication_classes = (TokenAuthentication, )
#     serializer_class = UserProfileSerializer

#     def get(self, request):
#         serializer = self.serializer_class(request.user, context={'request': request})
#         data_obj = {
#             'data': serializer.data,
#             'success': True
#             }
#         return HttpResponse(json.dumps(data_obj, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_200_OK)


# class UserListAPIView(APIView):
#     """
#     Endpoint for user list.
#     """
#     permission_classes = (IsAuthenticated, )
#     authentication_classes = (TokenAuthentication, )
#     serializer_class = UserProfileSerializer

#     def get(self, request):
#         queryset = User.objects.all()
#         serializer = self.serializer_class(queryset, many=True)
#         data_obj = {
#             'data': serializer.data,
#             'success': True
#         }
#         return HttpResponse(json.dumps(data_obj, cls=DjangoJSONEncoder), content_type='application/json', status=HTTP_200_OK)
