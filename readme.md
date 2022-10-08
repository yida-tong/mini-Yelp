<h1 style="text-align: center">

[Mini Yelp](https://tony-tong-cloud.wl.r.appspot.com/static/index.html)
</h1>

<p style="text-align: center">
Web app designed to search business information from angle of content focus and simplicity.<br/><br/>
Created page with HTML/CSS/JS (without any front-end lib/framework, no server-side rendering), built backend with Django REST as a proxy, queried Yelp fusion API.
 
</p>

<p style="text-align: center">
<a href="https://www.django-rest-framework.org/"><img src="https://img.shields.io/badge/Built%20with-Django%20REST%20Framework-/?style=plastic&logo=django" alt=""></a>
<a href="https://www.yelp.com/developers/documentation/v3"><img src="https://img.shields.io/badge/Endpoint-Yelp%20Fusion%20-/?style=plastic&logo=yelp&color=red" alt=""></a>
<a href="https://cloud.google.com/python/django/appengine"><img src="https://img.shields.io/badge/hosted%20on-GCP-/?style=plastic&logo=googlecloud&color=white" alt=""></a>
</p>

<div style="text-align: center">
 <img src="https://745062756.github.io/form.png">
 <img src="https://745062756.github.io/detail.png">
</div>

<hr/>

## Overview
### 1. Business Search
Query Params:
<ul>
<li>term (required)</li>
<li>latitude (required)</li>
<li>longitude (required)</li>
<li>categories (required)
 <ol>
  <li>all</li>
  <li>arts, All</li>
  <li>health, All</li>
  <li>hotelstravel, All</li>
  <li>food, All</li>
  <li>professional, All</li>
 </ol>
</li>
<li>radius (optional | unit: meter | integer < 40000)</li>
</ul>

**Sample call**:
```
Endpoint: https://tony-tong-cloud.wl.r.appspot.com

GET /business_list/?term=piazza&latitude=34.03004614509644&longitude=-118.28298823042003&radius=25000&categories=food%2C+All
```
### 2. Business Details
Param:
<ul>
<li>id (Returned by business search)</li>
</ul>

**Sample call**:
```
GET /business/WavvLdfdP6g8aZTtbBQHTw/details/
```

<br/>
⭐ <a href="https://tony-tong-cloud.wl.r.appspot.com">browsable root api</a> available
<hr/>

## Practice Objectives:
<ul>
<li>Server side python framework.</li>
<li>HTML, CSS, JavaScript, DOM, JSON, AJAX.</li>
</ul>
<hr/>

## Credits
 <table>
  <tr>
    <th>Description</th>
    <th>Link</th>
  </tr>
  <tr>
    <td>IP address to lat/long</td>
    <td><a href="https://ipinfo.io">ipinfo.io</a></td>
  </tr>
  <tr>
    <td>Physical address to lat/long</td>
    <td><a href="https://developers.google.com/maps/documentation/geocoding/start">google geocoding</a></td>
  </tr>
</table>