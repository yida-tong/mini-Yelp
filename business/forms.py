from django import forms
import decimal


class BusinessSearchForm(forms.Form):
    term = forms.CharField()
    latitude = forms.DecimalField(max_value=decimal.Decimal(90), min_value=decimal.Decimal(-90))
    longitude = forms.DecimalField(max_value=decimal.Decimal(180), min_value=decimal.Decimal(-180))
    categories = forms.ChoiceField(choices=[
        ('all', 'all'),
        ('arts, All', 'arts, All'),
        ('health, All', 'health, All'),
        ('hotelstravel, All', 'hotelstravel, All'),
        ('food, All', 'food, All'),
        ('professional, All', 'professional, All')
    ])
    radius = forms.IntegerField(max_value=40000, required=False)

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data['radius'] is None:
            del cleaned_data['radius']
        return cleaned_data
