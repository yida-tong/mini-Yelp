from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.reverse import reverse
from django import forms
import requests

from .forms import BusinessSearchForm

authHeader = {"Authorization": "Bearer V1KYODRPenQG5LQesVBBilqeev1YozUcMP6tO52GixN1yy53yIey5DPoJf20L7iNlaBVMwbn2PfHGOF__F1nYJw4rPES9dwgLdfL4t4S1Fmc7EsbRazKJ0YQIy8xY3Yx"}


class ApiRoot(APIView):
    def get(self, request, format=None):
        return Response({
            'business_search': "%s?term=piazza&latitude=34.03004614509644&longitude=-118.28298823042003&radius=25000&categories=food,+All" % reverse('business_list', request=request, format=format),
            'business_details': reverse('business_details', args=['WavvLdfdP6g8aZTtbBQHTw'], request=request, format=format)
        })


class BusinessList(APIView):
    def get(self, request, format=None):
        form = BusinessSearchForm(request.query_params)
        if form.is_valid():
            res = requests.get('https://api.yelp.com/v3/businesses/search', params=form.cleaned_data, headers=authHeader)
            reply = res.json()
            if res.ok:
                final = []
                for business in reply['businesses']:
                    each = dict()
                    each['id'] = business['id']
                    each['image_url'] = business['image_url']
                    each['name'] = business['name']
                    each['rating'] = business['rating']
                    each['distance'] = business['distance']
                    final.append(each)
                return Response(final, status=status.HTTP_200_OK)
            return Response(reply, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class BusinessDetails(APIView):
    def get(self, request, id, format=None):
        field = forms.CharField()
        cleaned_id = field.clean(id)
        res = requests.get('https://api.yelp.com/v3/businesses/'+cleaned_id, headers=authHeader)
        reply = res.json()
        if res.ok:
            final = dict()
            final['id'] = reply['id']
            final['name'] = reply['name']
            final['address'] = ' '.join(reply['location']['display_address']) if 'location' in reply and 'display_address' in reply['location'] else ''
            final['categories'] = [each['title'] for each in reply['categories']] if reply.get('categories') else []
            final['phone'] = reply.get('display_phone', '')
            final['price'] = reply.get('price', '')
            final['url'] = reply.get('url', '')
            final['photos'] = reply.get('photos', [])
            final['transactions'] = reply.get('transactions', [])
            if 'hours' in reply and len(reply['hours']) > 0 and 'is_open_now' in reply['hours'][0]:
                final['is_open_now'] = 1 if reply['hours'][0]['is_open_now'] else 0
            else:
                final['is_open_now'] = 2
            return Response(final, status=status.HTTP_200_OK)
        return Response(reply, status=status.HTTP_500_INTERNAL_SERVER_ERROR)