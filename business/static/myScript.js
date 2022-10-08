const getRequest = (url, data, fp) => {
    for (const key in data) {
        const temStr = encodeURIComponent(key) + '=' + encodeURIComponent(data[key])+'&';
        url+=temStr;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = () =>{
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 400) {
                fp(xhr.responseText);
            } else {
                alert(xhr.responseText);
            }
        }
    };
    xhr.send();
};

const renderRow = (idx, imgurl, name, rating, dist) => `
    <tr>
        <td>${idx}</td>
        <td style="padding: 5px 0;width: 110px"><img src="${imgurl}" alt="no img" width="95px" height="95px"></td>
        <td><span style="cursor: pointer" class="hover-name" onclick="showDetail(this.parentElement.parentElement.rowIndex)">${name}</span></td>
        <td>${rating}</td>
        <td>${(dist/1609.344).toFixed(2)}</td>
    </tr>
`;

const helper = (obj) => {
    let result = ``;
    obj.forEach((v, i) => {
        result += renderRow(i+1, v['image_url'], v['name'], v['rating'], v['distance']);
    });
    return result;
};

const renderer = (obj) => `
      <table style="margin: auto;background-color: white;width: 1000px">
        <tr>
          <th>No.</th>
          <th>Image</th>
          <th style="width: 550px"><span style="cursor: pointer" onclick="mySort(1)">Business Name</span></th>
          <th style="width: 140px"><span style="cursor: pointer" onclick="mySort(2)">Rating</span></th>
          <th style="width: 140px"><span style="cursor: pointer" onclick="mySort(3)">Distance (miles)</span></th>
        </tr>
        ${helper(obj)}
      </table>
`;

let gobj;

const renderTable = (text) => {
    const obj = JSON.parse(text);
    gobj = obj;
    if (obj.length===0) {
        document.getElementById('no_area').innerHTML = '<p style="text-align: center;border: 1px solid black;width: 1000px;margin: auto;background-color: white;padding: 3px">No record has been found</p>';
        document.getElementById('table_area').innerHTML = '';
        document.getElementById('detail_area').innerHTML = '';
    } else {
        document.getElementById('no_area').innerHTML = '';
        document.getElementById('table_area').innerHTML = renderer(obj);
        document.getElementById('detail_area').innerHTML = '';
        sw1 = 0;
        sw2 = 0;
        sw3 = 0;
        location.hash = '#test';
        location.hash = '#table_area';
    }
};

const businessSearch = (text) =>{
    const isChecked = document.getElementById('auto').checked;
    const radius = document.getElementById('ds').value;
    let data = {
        'term': document.getElementById('kw').value,
        'categories': document.getElementById('ct').value,
    };
    if (radius !== '') {
        const radiusMile = Number(radius);
        data['radius'] = Math.floor(radiusMile*1609.344);
    }

    let latitude;
    let longitude;
    const obj = JSON.parse(text);
    if (isChecked) {
        const loc_arr = obj.loc.split(',');
        latitude = loc_arr[0];
        longitude = loc_arr[1];
    } else {
        if (obj.results.length===0) {
            alert('Invalid Location');
            return;
        }
        latitude = obj.results[0].geometry.location.lat;
        longitude = obj.results[0].geometry.location.lng;
    }
    data['latitude'] = latitude;
    data['longitude'] = longitude;

    getRequest(location.protocol + "//" + location.hostname+':8000'+'/business_list/?', data, renderTable);
};

const formSubmit = () => {
    const isChecked = document.getElementById('auto').checked;
    if (isChecked) {
        const qParam = {'token': 'b0f9d3d54e689f'};
        getRequest('https://ipinfo.io/?', qParam, businessSearch);
    } else {
        const plc = document.getElementById('lc').value;
        const qParam = {'address': plc, 'key': 'AIzaSyDBqxxvoDy8IxRgSyTzLoAv7Rs_bFFeRb4'};
        getRequest('https://maps.googleapis.com/maps/api/geocode/json?', qParam, businessSearch);
    }
};

const ckboxClick = (ckbox) => {
    let loc = document.getElementById('lc');
    if (!ckbox.checked) {
        loc.setAttribute("required", "true");
        loc.disabled = false;
    } else {
        loc.removeAttribute("required");
        loc.value = '';
        loc.disabled = true;
    }
};

const formClear = () => {
    document.forms[0].reset();
    ckboxClick(document.getElementById('auto'));
    document.getElementById('no_area').innerHTML = '';
    document.getElementById('table_area').innerHTML = '';
    document.getElementById('detail_area').innerHTML = '';

};

let sw1 = 0;
let sw2 = 0;
let sw3 = 0;

const mySort = (func) =>{
    let cmpF;
    if (func===1) {
        if (sw1===0) {
            cmpF = (a, b) =>{
                return a['name'].localeCompare(b['name']);
            }
        }
        if (sw1===1) {
            cmpF = (a, b) =>{
                return -a['name'].localeCompare(b['name']);
            }
        }
        sw1 = 1-sw1;
    }

    if (func===2) {
        if (sw2===0) {
            cmpF = (a, b) =>{
                return -a['rating'] + b['rating'];
            }
        }
        if (sw2===1) {
            cmpF = (a, b) =>{
                return a['rating'] - b['rating'];
            }
        }
        sw2 = 1-sw2;
    }

    if (func===3) {
        if (sw3===0) {
            cmpF = (a, b) =>{
                return a['distance'] - b['distance'];
            }
        }
        if (sw3===1) {
            cmpF = (a, b) =>{
                return -a['distance'] + b['distance'];
            }
        }
        sw3 = 1-sw3;
    }

    gobj.sort(cmpF);
    document.getElementById('table_area').innerHTML = renderer(gobj);
};

const imgRenderer = (obj) =>{
    let content = ``;
    obj['photos'].forEach((v, i)=>{
    content += `                
                <div style="position: relative" class="detail-photo">
                  <img src="${v}" alt="no img" width="248px">
                  <div style="height: 25px"></div>
                  <div style="position: absolute;bottom: 3px;left: 100px">Photo ${i+1}</div>
                </div>
               `
    })
    return content;
};

const detailContent = (obj) => `
        <div style="margin: auto;width: 800px;background-color:white"><br/>
          <h4 style="text-align: center">${obj['name']}</h4>
          <hr style="width: 750px;border-style: solid;color: rgb(222,222,222);">
          <div class="grid-container-2" style="padding: 25px">
            ${ obj['is_open_now']!==2 ? `
                <div>
                  <h4 style="margin-bottom: 10px">Status</h4><br class="br-no-height"/>
                  ${ obj['is_open_now']===1? `<span style="padding: 7px;background-color: rgb(34,127,20);border-radius: 11px" class="detail-page-content-font">Open Now</span>`: `<span style="padding: 7px;background-color: rgb(255,0,8);border-radius: 11px" class="detail-page-content-font">Closed</span>`}
                </div>
            `: ``}
            
            ${obj['categories'].length !== 0? `
                <div>
                  <h4 style="margin-bottom: 5px">Category</h4><br class="br-no-height"/>
                  <span class="detail-page-content-font">${obj['categories'].join(' | ')}</span>
                </div>
            `: ``}
            
            ${obj['address'].length !== 0? `
                <div>
                  <h4 style="margin-bottom: 5px">Address</h4><br class="br-no-height"/>
                  <span class="detail-page-content-font">${obj['address']}</span>
                </div>
            `: ``}
            
            ${obj['phone'].length !== 0? `
                <div>
                  <h4 style="margin-bottom: 5px">Phone Number</h4><br class="br-no-height"/>
                  <span class="detail-page-content-font">${obj['phone']}</span>
                </div>
            `: ``}
            
            ${obj['transactions'].length !== 0? `
                <div>
                  <h4 style="margin-bottom: 5px">Transactions Supported</h4><br class="br-no-height"/>
                  <span class="detail-page-content-font">${obj['transactions'].join(' | ')}</span>
                </div>
            `: ``}
            
            ${obj['price'].length !== 0? `
                <div>
                  <h4 style="margin-bottom: 5px">Price</h4><br class="br-no-height"/>
                  <span class="detail-page-content-font">${obj['price']}</span>
                </div>
            `: ``}
            
            ${obj['url'].length !== 0? `
                <div>
                  <h4 style="margin-bottom: 5px">More info</h4><br class="br-no-height"/>
                  <a target="_blank" href="${obj['url']}" class="detail-page-content-font">Yelp</a>
                </div>
            `: ``}
          </div>
          
          ${obj['photos'].length!==0? `
            <div class="grid-container-3" style="padding: 20px 20px 0 20px">
                ${imgRenderer(obj)}
            </div>
          `:``}     
          <br/>
        </div>
    `;

const renderDetail = (text) =>{
    const obj = JSON.parse(text);
    document.getElementById('detail_area').innerHTML = detailContent(obj);
    location.hash = '#test';
    location.hash = '#detail_area';
};

const showDetail = (idx) =>{
    const id = gobj[idx-1]['id'];
    const data = {};
    getRequest(location.protocol + "//" + location.hostname+':8000'+'/business/'+id+'/details/?', data, renderDetail);
};