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
        var el_title = document.createElement("div");
        var el_skrifa = document.createTextNode(data[i].eventDateName);
        el_title.appendChild(el_skrifa);
        var el_mynd = document.createElement("img");
        el_mynd.src = data[i].imageSource;
        el_li.setAttribute('data-tags', data[i].eventHallName);
        el_li.appendChild(el_mynd);
        el_li.appendChild(el_title);
        el_li.className += " flokka";
        container.appendChild(el_li);
        upplysingar(el_li, data[i]); //Keyrt aðferðina til að bæta við upplysingum
    }
}

moment.lang("is"); //Stillt moment format-ið á íslensku
function upplysingar(el_li, data){
    //ég ætla að bæta við info-i í li tag
    //bæta við auka info
    var el_info = document.createElement("ul");

    for (variable in data) {
        console.log(variable);
        //data[i]
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



//-------------------------------SEARCH BARINN ---------------------------------
//Þetta er mest allt kóði úr bókinni breyttur smá til að virka á síðunni minni
//Með þessum leitarreit er hægt að leita af hverju sem er sem tengist atburðinum
//eins og dagsetningu, nafni, stað, og það kemur upp
function search(){
    var $elementid = $('#container .flokka');                     //nær í alla flokkana eða allt í containerinum með clasann .flokka á
    var $leit = $('#leita');                              //element fyrir search barinn minn
    var cacheid = [];                                             //array sem infoið um atbyrðina eru geymdir í

    $elementid.each(function() {
        cacheid.push({                                              //pushar inn í chacheid arrayið
            element: this,                                            //pushar elementinu sem er li tagið í þessu tilfelli
            text: this.innerHTML.trim().toUpperCase()                 //tekur öll white spaces úr textanum og setur það í uppercase
        });
    });
//functionið sem filterar
    function filter() {
        var query = this.value.trim().toUpperCase();                //tekur inn querið hja notanda trimmar það og setur í uppercase
        cacheid.forEach(function(img) {                             //keyrir í gegnum cacheid arrayið
            var index = 0;
            if (query) {                                              //athuga ef query er tómt
                index = img.text.indexOf(query);                        //athuga ef query textinn er í elementinu
            }
            img.element.style.display = index === -1 ? 'none' : '';   //sýna eða fela
        });
    }
    //
    //ef browserinn supportar oninput eða "input event" þá er það notað, annars er notað keyup
    if ('oninput' in $leit[0]) {
        $leit.on('input', filter);
    } else {
        $leit.on('keyup', filter);
    }
}



//------------------------------- Image Filtering ---------------------------------
//Þetta er nánast allt kóði úr bókinni, þó ég breyti smá þannig það virkar á minni síðu
function filter() {
    var $vidburdur = $('#container .flokka');          //Geymir öll elementin
    var $takkar = $('#buttons');                    //Geymir alla takkana
    var tagged = {};                                 // býr til tag object

    //hérnar er keyrt í gegnum allt og skoðað data tögin og þau svo sett í array
    $vidburdur.each(function() {
      var li = this;                                //variable sem geymir þetta li element
      var tags = $(this).data('tags');              // þær í gögnin um li tagið (data tagið)
      if (tags) {                                   // ef elementið er með tag
        tags.split(',').forEach(function(tagName) { // splittar tögunum á kommu ef það er einn atburður með mörg tög
          if (tagged[tagName] == null) {            // ef atburðurinn er ekki með tag þá keyrist þetta
            tagged[tagName] = [];                   // bætir við tómu arrayi í tagged objectið
          }
          tagged[tagName].push(li);                 //Bætir li elementinu við tagged objectið
        });
      }
    });

//Hérna er búið til show all takkann sem sýnir alla viðburðina
    $('<button/>', {                                 // Create empty button
      text: 'Allir atburðir',                              // Add text 'show all'
      class: 'active',                               // Make it active
      click: function() {                            // Add onclick handler to
        $(this)                                      // Get the clicked on button
          .addClass('active')                        // Add the class of active
          .siblings()                                // Get its siblings
          .removeClass('active');                    // Remove active from siblings
        $vidburdur.show();                                // Show all images
      }
    }).appendTo($takkar);                           // Add to buttons

    //Hérna er búið til sér takka fyrir hvern einstaka viðburð
    $.each(tagged, function(tagName) {               // For each tag name
      $('<button/>', {                               // Create empty button
        text: tagName + ' (' + tagged[tagName].length + ')', // Add tag name
        click: function() {                          // Add click handler
          $(this)                                    // The button clicked on
            .addClass('active')                      // Make clicked item active
            .siblings()                              // Get its siblings
            .removeClass('active');                  // Remove active from siblings
          $vidburdur                                      // With all of the images
            .hide()                                  // Hide them
            .filter(tagged[tagName])                 // Find ones with this tag
            .show();                                 // Show just those images
        }
      }).appendTo($takkar);                         // Add to the buttons
    });
}
