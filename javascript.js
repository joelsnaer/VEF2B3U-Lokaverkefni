$.ajax({
  'url': 'http://apis.is/concerts',
  'type': 'GET',
  'dataType': 'json',
  'success': function(gogn) {
    console.log(gogn);
    skrifa(gogn);
    filter();
    search();
  }
});

var container = document.getElementById("container");
function skrifa(gogn){
    var data = gogn.results;
    for (var i = 0; i < data.length; i++) {
        var el_li = document.createElement("li");
        el_li.className = "concert";
        var el_div = document.createElement("div");
        var el_skrifa = document.createTextNode(data[i].eventDateName);
        el_div.appendChild(el_skrifa);
        var el_mynd = document.createElement("img");
        el_mynd.src = data[i].imageSource;
        el_li.setAttribute('data-tags', data[i].eventHallName);
        el_li.appendChild(el_mynd);
        el_li.appendChild(el_div);
        el_li.className += " flokka";
        container.appendChild(el_li);
        upplysingar(el_li, data[i]); //Keyrt aðferðina til að bæta við upplysingum
    }
}

moment.lang("is"); //Stillt moment format-ið á íslensku
function upplysingar(el_li, data){

    var el_info = document.createElement("ul");

    for (variable in data) {
        console.log(variable);
        if (variable !== "imageSource" && variable !== "dateOfShow") { //Ef breytan er ekki myndin eða dagsetningin fyrir tónleikana er gert þetta
            var el_li2 = document.createElement('li');
            var el_text = document.createTextNode(data[variable]);
            el_li2.appendChild(el_text);
            el_info.appendChild(el_li2);
        }
        else if (variable === "dateOfShow") { //Ef Breytan er dagsetningin er gert þetta
            var dagsetning = data[variable]; //Tekið inn dagsetninguna
            var breytt = moment(dagsetning).format("D MMMM YYYY, h:mm a"); //Breytt henni yfir í moment.js format
            var el_li3 = document.createElement('li'); //Birt dagsetninguna
            var el_text1 = document.createTextNode(breytt);
            el_li3.appendChild(el_text1);
            el_info.appendChild(el_li3);
        }
    }
    el_info.className = "upplys";
    el_li.appendChild(el_info);
}


function search(){
    var $elementid = $('#container .flokka');
    var $leit = $('#leita');
    var cacheid = [];
    $elementid.each(function() {
        cacheid.push({
            element: this,
            text: this.innerHTML.trim().toUpperCase()
        });
    });
    function filter() {
        var query = this.value.trim().toUpperCase();
        cacheid.forEach(function(img) {
            var index = 0;
            if (query) {
                index = img.text.indexOf(query);
            }
            img.element.style.display = index === -1 ? 'none' : '';
        });
    }
    if ('oninput' in $leit[0]) {
        $leit.on('input', filter);
    } else {
        $leit.on('keyup', filter);
    }
}


function filter() {
    var $tonleikar = $('#container .flokka');
    var $btn = $('#buttons');
    var tagged = {};
    $tonleikar.each(function() {
      var li = this;
      var tags = $(this).data('tags');
      if (tags) {
        tags.split(',').forEach(function(tagName) {
          if (tagged[tagName] == null) {
            tagged[tagName] = [];
          }
          tagged[tagName].push(li);
        });
      }
    });
    $('<button/>', {
      text: 'Allir atburðir',
      class: 'active',
      click: function() {
        $(this)
          .addClass('active')
          .siblings()
          .removeClass('active');
        $tonleikar.show();
      }
    }).appendTo($btn);
    $.each(tagged, function(tagName) {
      $('<button/>', {
        text: tagName + ' (' + tagged[tagName].length + ')',
        click: function() {
          $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
          $tonleikar
            .hide()
            .filter(tagged[tagName])
            .show();
        }
      }).appendTo($btn);
    });
}
