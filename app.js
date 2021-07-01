const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')
const navLogo = document.querySelector('#navbar__logo')

//display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
}

menu.addEventListener('click', mobileMenu)

//show active Menu when scrolling
const highlightMenu = () => {
    const elem = document.querySelector('.highlight')
    const homeMenu = document.querySelector('#home-page')
    const graphMenu = document.querySelector('#graph-page')
    const tableMenu = document.querySelector('#table-page')
    let scrollPos = window.scrollY

    //adds 'highlight' class to my menu items
    if (window.innerWidth > 960 && scrollPos < 500) {
        homeMenu.classList.add('highlight');
        graphMenu.classList.remove('highlight');
        return;
    } else if (window.innerWidth > 960 && scrollPos < 1400) {
        graphMenu.classList.add('highlight');
        homeMenu.classList.remove('highlight');
        tableMenu.classList.remove('highlight');
        return;
    } else if (window.innerWidth > 960 && scrollPos < 2345) {
        tableMenu.classList.add('highlight');
        graphMenu.classList.remove('highlight');
        return;
    }

    if ((elem && window.innerWIdth < 960 && scrollPos < 500) || elem) {
        elem.classList.remove('highlight');
    }
};

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

//  Close mobile Menu when clicking on a menu item
const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active');
    if (window.innerWidth <= 768 && menuBars) {
        menu.classList.toggle('is-active');
        menuLinks.classList.remove('active');
    }
};

menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});


var map = L.map('mapid')
          .addLayer(CartoDB_Positron)
          .setView([-6.8928,107.8201], 8);

//Create date_list
var start = new Date(2021, 5, 7)
var end = new Date(2021, 5, 14);

function updateDate(){
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const month = monthNames[end.getMonth()];
    const day = String(end.getDate()).padStart(2, '0');
    const year = end.getFullYear();
    const output = day + '\n'+ month +'\n'+ year;

    document.getElementById("update__date").innerHTML = output;    
}

updateDate()


var date_list = []
for (d = start; d < end; d.setDate(d.getDate() + 1)) {
    var date = new Date(d),
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    date_list.push([year, month, day].join('-'));
}

function uniqByKeepLast(data,key){
    return [
        ...new Map(
            data.map(x => [key(x), x])
        ).values()
    ]
}

var final = []

for(var i = 0; i<date_list.length; i++){
    var result = []
    $.ajax({
        type: "GET",
        url: "assets/sebaran"+date_list[i]+".txt",
        success: function(data) {
            var response = JSON.parse(data);
            var temp = response.data.content;
            result = uniqByKeepLast(temp, it => it.id);
        },
        // by setting async: false the code after the 
        // $.ajax will not execute until it has completed
        async: false
    });
    final = final.concat(result)
    final = uniqByKeepLast(final, it => it.id);
}

function getMetaFinal() {
    var kode_kab = ([...new Set(final.map(item => item.kode_kab))]).sort();
    var result = []
    var nama_kab = ["Total Keseluruhan"]
    var total_confirm = [Object.values(final).filter(function(item) {
                            return item.status == "CONFIRMATION"}).length]
    var active_confirm = [Object.values(final).filter(function(item) {
                            return item.status == "CONFIRMATION" && item.stage != "Meninggal" && item.stage != "Selesai"}).length]
    var completed_confirm = [Object.values(final).filter(function(item) {
                            return item.status == "CONFIRMATION" && item.stage == "Selesai"}).length]
    var died_confirm = [Object.values(final).filter(function(item) {
                            return item.status == "CONFIRMATION" && item.stage == "Meninggal"}).length]
    var total_suspect = [Object.values(final).filter(function(item) {
                            return item.status == "SUSPECT"}).length]
    var active_suspect = [Object.values(final).filter(function(item) {
                            return item.status == "SUSPECT" && item.stage != "Discarded"}).length]
    var dis_suspect = [Object.values(final).filter(function(item) {
                            return item.status == "SUSPECT" && item.stage == "Discarded"}).length]
    var total_cc = [Object.values(final).filter(function(item) {
                            return item.status == "CLOSECONTACT"}).length]
    var active_cc = [Object.values(final).filter(function(item) {
                            return item.status == "CLOSECONTACT" && item.stage != "Discarded"}).length]
    var dis_cc = [Object.values(final).filter(function(item) {
                            return item.status == "CLOSECONTACT" && item.stage == "Discarded"}).length]
    var total_prob = [Object.values(final).filter(function(item) {
                            return item.status == "PROBABLE"}).length]
    var active_prob = [Object.values(final).filter(function(item) {
                            return item.status == "PROBABLE" && item.stage != "Discarded"}).length]
    var dis_prob = [Object.values(final).filter(function(item) {
                            return item.status == "PROBABLE" && item.stage == "Discarded"}).length]
    var temp_kode_kab = ["Total"]

    for(var i = 0; i<kode_kab.length; i++){
        var temp = Object.values(final).filter(function(item) {
        return item.kode_kab == kode_kab[i]})
        subnama_kab = temp[0].nama_kab
        subtotal_confirm = Object.values(temp).filter(function(item) {
        return item.status == "CONFIRMATION"}).length 
        subactive_confirm = Object.values(temp).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage != "Meninggal" && item.stage != "Selesai"}).length
        subcompleted_confirm = Object.values(temp).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage == "Selesai"}).length
        subdied_confirm = Object.values(temp).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage == "Meninggal"}).length
        subtotal_suspect = Object.values(temp).filter(function(item) {
        return item.status == "SUSPECT"}).length
        subactive_suspect = Object.values(temp).filter(function(item) {
        return item.status == "SUSPECT" && item.stage != "Discarded"}).length
        subdis_suspect = Object.values(temp).filter(function(item) {
        return item.status == "SUSPECT" && item.stage == "Discarded"}).length
        subtotal_cc = Object.values(temp).filter(function(item) {
        return item.status == "CLOSECONTACT"}).length
        subactive_cc = Object.values(temp).filter(function(item) {
        return item.status == "CLOSECONTACT" && item.stage != "Discarded"}).length
        subdis_cc = Object.values(temp).filter(function(item) {
        return item.status == "CLOSECONTACT" && item.stage == "Discarded"}).length
        subtotal_prob = Object.values(temp).filter(function(item) {
        return item.status == "PROBABLE"}).length
        subactive_prob = Object.values(temp).filter(function(item) {
        return item.status == "PROBABLE" && item.stage != "Discarded"}).length
        subdis_prob = Object.values(temp).filter(function(item) {
        return item.status == "PROBABLE" && item.stage == "Discarded"}).length
        
        temp_kode_kab.push(kode_kab[i])
        nama_kab.push(subnama_kab)
        total_confirm.push(subtotal_confirm)
        active_confirm.push(subactive_confirm)
        completed_confirm.push(subcompleted_confirm)
        died_confirm.push(subdied_confirm)
        total_suspect.push(subtotal_suspect)
        active_suspect.push(subactive_suspect)
        dis_suspect.push(subdis_suspect)
        total_cc.push(subtotal_cc)
        active_cc.push(subactive_cc)
        dis_cc.push(subdis_cc)
        total_prob.push(subtotal_prob)
        active_prob.push(subactive_prob)
        dis_prob.push(subdis_prob)
    }
    
    result.push({"nama_kab":nama_kab,
                 "kode_kab":temp_kode_kab,
                 "total_confirm": total_confirm,
                 "active_confirm":active_confirm,
                 "completed_confirm":completed_confirm,
                 "died_confirm":died_confirm,
                 "total_suspect":total_suspect,
                 "active_suspect":active_suspect,
                 "dis_suspect":dis_suspect,
                 "total_cc":total_cc,
                 "active_cc":active_cc,
                 "dis_cc":dis_cc,
                 "total_prob":total_prob,
                 "active_prob":active_prob,
                 "dis_prob":dis_prob})
    return result
}

var meta_final = getMetaFinal();

var scores = meta_final[0].active_confirm.slice(1,-1);
var daerah = meta_final[0].nama_kab.slice(1,-1);

var scores2 = scores.slice(0);
var daerah2 = daerah.slice(0);
function byScores(a,b){
  return scores[daerah.indexOf(a)]-scores[daerah.indexOf(b)];
}
scores_final = scores2.sort(function(a, b){return a - b})
daerah_final = daerah2.sort(byScores);

$.when(
  $.getJSON('jb-adm-2.geojson'),
  $.getJSON('https://data.covid19.go.id/public/api/skor.json'),
  $.getJSON("assets/sebaran"+"2021-06-06"+".txt")
  ).done(function (responseGeojson, responseSkor, responseData) {
    var data = responseSkor[0]
    var geojson = responseGeojson[0]
    console.log(data)
    for (var i = 0; i < data.data.length; i++){
        if(data.data[i].kode_prov == 32){
            var temp = []
            temp.kode_kota = data.data[i].kode_kota
            temp.hasil = data.data[i].hasil
            if (temp.hasil == "RESIKO TINGGI") {
                temp.hasil = 1;
            }
            else if (temp.hasil == "RESIKO SEDANG") {
                temp.hasil = 2;
            }
            else if (temp.hasil == "RESIKO RENDAH") {
                temp.hasil = 3;
            }
            else if (temp.hasil == "TIDAK ADA KASUS") {
                temp.hasil = 4;
            }
            else if (temp.hasil == "TIDAK TERDAMPAK") { 
                temp.hasil = 5;
            }
            Object.values(geojson)[1].filter(function(item){
                return item.properties.ADM2_PCODE == "ID"+data.data[i].kode_kota
                    })[0].properties.hasil = temp.hasil
            Object.values(geojson)[1].filter(function(item){
                return item.properties.ADM2_PCODE == "ID"+data.data[i].kode_kota
                    })[0].properties.status = data.data[i].hasil
        }
    }
    //assign waduk cirata
    Object.values(geojson)[1].filter(function(item){
        return item.properties.ADM2_PCODE == "ID3288"
            })[0].properties.hasil = 5
    Object.values(geojson)[1].filter(function(item){
        return item.properties.ADM2_PCODE == "ID3288"
            })[0].properties.status = "TIDAK TERDAMPAK"

    //assign persentase resiko
    var persentase = []
    for (var i = 1; i<6 ;i++){
    persentase.push((Object.values(geojson)[1].filter(function(item){
                        return item.properties.hasil == i}).length / geojson.features.length * 100).toFixed(1))
    } 

    var choropleth;

    function getColor(value) {
        return value == 1  ? "#bd1900" :
               value == 2  ? "#fc8403" :
               value == 3  ? "#ded716" :
               value == 4  ? "#00bd55" :
               value == 5  ? "#00bd55" :
                             "#808080";
    }

    //highlight polygon
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
            // circleLayer.bringToFront();
        }

        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        var layer = e.target;
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToBack();
        }
        choropleth.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
       map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    //Info Control
    var info = L.control();

    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function(props) {
        this._div.innerHTML = '<h4>Peta Zonasi Resiko</h4>' + '<h4>Provinsi Jawa Barat</h4>' + (props ?
            '<b>' + props.ADM2_EN + '</b><br />' + props.status  :
            '');
    };

    info.addTo(map);

    //legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 2, 3, 4, 5],
            labels = ["<h5>RESIKO TINGGI</h5><h4>" + persentase[0] + "%</h4>",
                      "<h5>RESIKO SEDANG</h5><h4>" + persentase[1] + "%</h4>", 
                      "<h5>RESIKO RENDAH</h5><h4>" + persentase[2] + "%</h4>",
                      "<h5>TIDAK ADA KASUS</h5><h4>" + persentase[3] + "%</h4>",
                      "<h5>TIDAK TERDAMPAK</h5><h4>" + persentase[4] + "%</h4>"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<div class="sub-legend"><i style="background:' + getColor(grades[i]) + '"></i>' + labels[i] +'</div>';
        }
        return div;
    };

    legend.addTo(map);

    // var homeButton = L.control({position: "topleft"});

    // homeButton.onAdd = function (mao){
    //     var div = L.DomUtil.create('div', 'homebutton');
    //     div.innerHTML = '<a class="fa fa-home" style="line-height:2.65;"></a>'
    //     return div
    // }

    // homeButton.addTo(map);

    // var customControl =  L.Control.extend({        
    //   options: {
    //     position: 'topleft'
    //   }
    // });

    // customControl.onAdd = function (map) {
    //     var container = L.DomUtil.create('div','homebutton');

    //     div.innerHTML = '<a class="fa fa-home" style="line-height:2.65;"></a>'

    //     container.onclick = function(){
    //       console.log('buttonClicked');
    //     }

    //     return container;
    // }
    

    // map.addControl(new customControl());

    function style(features) {
        return {
            fillColor: getColor(features.properties.hasil),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    var choropleth = L.geoJson(geojson, {style: style,
                        onEachFeature: onEachFeature}).addTo(map);

    function uniqByKeepLast(data,key){
        return [
            ...new Map(
                data.map(x => [key(x), x])
            ).values()
        ]
    }

    var clean = uniqByKeepLast(responseData[0].data.content, it => it.id);
    // console.log(final)
    var confirm = Object.values(final).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage != "Meninggal" && item.stage != "Selesai"
    })

    var circle = []
    for (var i = 0; i< confirm.length; i++){
        circle.push(L.circle([confirm[i].latitude,confirm[i].longitude], {radius: 2, color:'grey'}));
    }

    var confirm_stat = [];

    var circleLayer = L.layerGroup(circle).addTo(map);
    // var polygon = L.geoJson(geojson).addTo(circleLayer);
    // var choroplethlayer = L.layerGroup(choropleth);
    // var overlayMaps = {
       // "Sebaran Titik": circleLayer,
    //    "Peta Resiko" : choropleth
    // };
    // L.control.layers(overlayMaps).addTo(map);
})

function updateStat () {
    total_confirm = Object.values(final).filter(function(item) {
        return item.status == "CONFIRMATION"}).length
    active_confirm = Object.values(final).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage != "Meninggal" && item.stage != "Selesai"
    }).length
    completed_confirm = Object.values(final).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage == "Selesai"
    }).length
    died_confirm = Object.values(final).filter(function(item) {
        return item.status == "CONFIRMATION" && item.stage == "Meninggal"
    }).length

    total_suspect = Object.values(final).filter(function(item) {
        return item.status == "SUSPECT"}).length
    active_suspect = Object.values(final).filter(function(item) {
        return item.status == "SUSPECT" && item.stage != "Discarded"
    }).length
    dis_suspect = Object.values(final).filter(function(item) {
        return item.status == "SUSPECT" && item.stage == "Discarded"
    }).length

    total_cc = Object.values(final).filter(function(item) {
        return item.status == "CLOSECONTACT"}).length
    active_cc = Object.values(final).filter(function(item) {
        return item.status == "CLOSECONTACT" && item.stage != "Discarded"
    }).length
    dis_cc = Object.values(final).filter(function(item) {
        return item.status == "CLOSECONTACT" && item.stage == "Discarded"
    }).length

    total_prob = Object.values(final).filter(function(item) {
        return item.status == "PROBABLE"}).length
    active_prob = Object.values(final).filter(function(item) {
        return item.status == "PROBABLE" && item.stage != "Discarded"
    }).length
    dis_prob = Object.values(final).filter(function(item) {
        return item.status == "PROBABLE" && item.stage == "Discarded"
    }).length

    document.getElementById("total__confirm").innerHTML = total_confirm;
    document.getElementById("active__confirm").innerHTML = active_confirm;
    document.getElementById("completed__confirm").innerHTML = completed_confirm;
    document.getElementById("died__confirm").innerHTML = died_confirm;
    document.getElementById("total__suspect").innerHTML = total_suspect;
    document.getElementById("active__suspect").innerHTML = active_suspect;
    document.getElementById("dis__suspect").innerHTML = dis_suspect;
    document.getElementById("total__cc").innerHTML = total_cc;
    document.getElementById("active__cc").innerHTML = active_cc;
    document.getElementById("dis__cc").innerHTML = dis_cc;
    document.getElementById("total__prob").innerHTML = total_prob;
    document.getElementById("active__prob").innerHTML = active_prob;
    document.getElementById("dis__prob").innerHTML = dis_prob;
}

updateStat()

//Table Data
var tableData = []
for (var i = 0; i<meta_final[0].kode_kab.length; i++) {
    var temp = []
    // for(var j = 0 ; j < Object.keys(meta_final[0]).length; j++){
    //     temp.push(j)
    // }
    temp.push(meta_final[0].nama_kab[i].toString())
    temp.push(meta_final[0].total_confirm[i].toString())
    temp.push(meta_final[0].active_confirm[i].toString())
    temp.push(meta_final[0].completed_confirm[i].toString())
    temp.push(meta_final[0].died_confirm[i].toString())

    var key = "values";
    var obj = {};
    obj[key] = temp;
    tableData.push(obj);
}
// console.log(meta_final[0].nama_kab.slice(1,-1))

// window:load event for Javascript to run after HTML
// because this Javascript is injected into the document head
window.addEventListener('load', function() {
  // Javascript code to execute Object.keys(after DOM con).length 
  // full ZingChart schema can be found here:
  // https://www.zingchart.com/docs/api/json-configuration/
  const myConfig = {
    type: 'hbar',
    plotarea: {
        'adjust-layout': true,
        'marginBottom': 0,
        'marginRight': 35,
        'marginTop': 40,
    },
    // title: {
    //   text: 'Kasus Konfirmasi Aktif',
    //   fontSize: 24,
    //   color: '#5aaa4e'
    // },
    // legend: {
    //   draggable: false,
    // },
    scaleX: {
      itemsOverlap: true,
      maxItems: daerah_final.length,
      // set scale label
      label: {
        text: '',
        fontSize: 24
      },
      // convert text on scale indices
      labels: daerah_final
    },
    scaleY: {
      // scale label with unicode character
      label: {
        text: 'Jumlah',
        fontSize: 16,
        color: '#5aaa4e'
      }
    },
    plot: {
      // animation docs here:
      // https://www.zingchart.com/docs/tutorials/design-and-styling/chart-animation/#animation__effect
      animation: {
        effect: 'ANIMATION_EXPAND_BOTTOM',
        method: 'ANIMATION_STRONG_EASE_OUT',
        sequence: 'ANIMATION_BY_NODE',
        speed: 275,
      }
    },
    series: [{
        // plot 1 values, linear data
        values: scores_final,
        text: 'konfirmasi dipantau',
        backgroundColor: '#5aaa4e'
      },
      // {
      //   // plot 2 values, linear data
      //   values: meta_final[0].active_suspect,
      //   text: 'Suspect Dipantau',
      //   backgroundColor: '#70cfeb'
      // },
      // {
      //   // plot 2 values, linear data
      //   values: meta_final[0].active_cc,
      //   text: 'Kontak Erat Dipantau',
      //   backgroundColor: '#8ee9de'
      // }
    ],
    tooltip: {
        text: '%kl <br> %v Konfirmasi Positif - Aktif',
        borderRadius: '5px',
        shadow: 0,
        textAlign: 'left'
    },
  };
 
  // render chart with width and height to
  // fill the parent container CSS dimensions
  zingchart.render({
    id: 'myChart',
    data: myConfig,
    height: '650px',
    width: '100%'
  });

  var myTableConfig = {
  "graphset": [{
    "type": "grid",
    "plotarea": {
      "margin": "35 20 20 20"
    },
    "options": {
      "header-row": false
    },
      options: {
        'col-labels': [ "Nama Kota/Kabupaten", "Terkonfirmasi", "Isolasi/Dalam Perawatan", "Selesai Isolasi/Sembuh", "Meninggal" ],
      },
    "series": tableData
    // "series": [{
    //     "values": ["Jon", "Anderson", "January 9, 1957", "United Kingdom"]
    //   },
    //   {
    //     "values": ["Steve", "Hogarth", "January 25, 1950", "United Kingdom"]
    //   },
    //   {
    //     "values": ["Jim", "Carrey", "June 12, 1972", "United States"]
    //   },
    //   {
    //     "values": ["Paul", "Hogan", "October 22, 1956", "Australia"]
    //   },
    //   {
    //     "values": ["Brenden", "Morrow", "January 16, 1979", "Canada"]
    //   },
    //   {
    //     "values": ["Kate", "Moss", "January 16, 1974", "United Kingdom"]
    //   },
    //   {
    //     "values": ["David", "Chokachi", "January 16, 1968", "United States"]
    //   },
    //   {
    //     "values": ["Josie", "Davis", "January 16, 1973", "United Kingdom"]
    //   },
    //   {
    //     "values": ["Alex", "Morgan", "July 2, 1989", "United States"]
    //   },
    //   {
    //     "values": ["Tom", "Cruise", "July 3, 1962", "United States"]
    //   },
    //   {
    //     "values": ["Tony", "Bennett", "August 3, 1926", "United States"]
    //   },
    //   {
    //     "values": ["Martha", "Stewart", "August 3, 1941", "United States"]
    //   },
    //   {
    //     "values": ["Tom", "Brady", "August 3, 1977", "United States"]
    //   },
    //   {
    //     "values": ["Julie", "Bowen", "March 3, 1970", "United States"]
    //   },
    //   {
    //     "values": ["Barack", "Obama", "August 4, 1961", "United States"]
    //   }
    // ]
  }]
};
 
zingchart.render({
  id: 'table__chart',
  data: myTableConfig,
  height: "100%",
  width: "100%"
});
});


function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

var json_obj = JSON.parse(Get("https://data.covid19.go.id/public/api/skor.json"));
console.log("this is the author name: "+json_obj);