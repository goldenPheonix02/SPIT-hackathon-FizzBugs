var map;
var service;
var infowindow;
var c_data;
console.log("hehe")
fetch("./data.json")
    .then(response => {
        return response.json();
    })
    .then(data => { c_data = data });

console.log(c_data);


function getColleges(choice) {
    var arr = []
    for (var i = 0; i < c_data.length; i++) {
        var flag = 0
        var cur_all = c_data[i]["exam-type"].concat(c_data[i]["domain"])
            // console.log(cur_all);
        for (var j = 0; j < choice.data_all.length; j++) {
            if (cur_all.includes(choice.data_all[j])) {

                console.log(c_data[i], choice.data_all[j]);

                if (choice.cutoff >= c_data[i]["cutoff"]) {

                    arr.push(c_data[i]);
                }
            }
        }
    }
    return uniq = [...new Set(arr)];
}





function checkScroll() {
    var startY = $('.header').height() * 3; //The point where the navbar changes in px

    if ($(window).scrollTop() > startY) {
        $('.header').addClass("scrolled");
    } else {
        $('.header').removeClass("scrolled");
    }
}

if ($('.header').length > 0) {
    $(window).on("scroll load resize", function() {
        checkScroll();
    });
}

function appendCollege(name) {
    const collg = document.createElement("div")
    collg.innerText = name;
    var parent = document.getElementsByClassName("row")[0]
    collg.classList.add("college")
    parent.appendChild(collg)
}



function initMap() {
    const slider = document.getElementById("myRange")
    console.log(slider.value);
    const slider_val = document.getElementById("sliderVal")

    document.getElementById("myRange").addEventListener("input", () => {
        slider_val.innerText = slider.value;
    })



    document.querySelectorAll(".option").forEach((e) => {
        // console.log(e);
        e.addEventListener("click", () => {
            e.classList.toggle("selected")
        })
    })

    var lat = 19.1364;
    var long = 72.8484;
    var loc = new google.maps.LatLng(19.1364, 72.8484);
    infowindow = new google.maps.InfoWindow();

    // map = new google.maps.Map(document.getElementById("map"), {
    //     center: loc,
    //     zoom: 12,
    // });


    const input1 = document.querySelector("#radius")
    const input2 = document.querySelector("#location")
    const filter = document.getElementById("fil")
        // console.log(input.value);

    document.querySelector("button").addEventListener("click", (e) => {
        e.preventDefault()
        map = new google.maps.Map(document.getElementById("map"), {
            center: loc,
            zoom: 12,
        });


        var radius = input1.value * 1000;
        input1.value = ""


        if (input2.value !== "") {
            var place = input2.value
            console.log(place);
            var array = [];

            const request = {
                query: place,
                fields: ['name', 'geometry'],
            }

            var service = new google.maps.places.PlacesService(map);
            service.findPlaceFromQuery(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    // var { lat, lng } = results[0].geometry.location
                    map.setCenter(results[0].geometry.location);
                    console.log(results[0].geometry.location);
                    lat = results[0].geometry.location.lat()
                    long = results[0].geometry.location.lng()


                    let location = new google.maps.LatLng(lat, long);

                    const request = {
                        location: location,
                        radius: radius,
                        type: ["university"],
                        keyword: ["college", "institute"]
                    };



                    service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(request, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                            for (let i = 0; i < results.length; i++) {
                                createMarker(results[i]);
                                array.push(results[i].name)
                                    // appendCollege(results[i].name)
                                console.log(results[i].name) //FULL NAME OF PLACE

                                // console.log(results[i].geometry.location.lat(), results[i].geometry.location.lng())
                            }
                            map.setCenter(results[0].geometry.location);
                        }

                    });

                }
            });
        } else {
            let location = new google.maps.LatLng(lat, long);
            var array = []

            const request = {
                location: location,
                radius: radius,
                type: ["university"],
                keyword: ["college", "institute"]
            };
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                        array.push(results[i].name)
                        console.log(results[i].name) //FULL NAME OF PLACE

                    }
                    map.setCenter(results[0].geometry.location);
                }

            });

        }
        console.log(array[0], "e"); //ARRAY OF COLLEGES
        // console.log(array[0]);

    })


    filter.addEventListener("click", () => {
        var parent = document.getElementsByClassName("row")[0]
        parent.innerHTML = ""

        const arry = []
        const branch = []
        document.querySelectorAll(".ee .option").forEach((e) => {
            if (e.classList.contains("selected")) {
                arry.push(e.id)
            }
        })
        document.querySelectorAll(".branch .option").forEach((e) => {
            if (e.classList.contains("selected")) {
                arry.push(e.id)
            }
        })

        const selected = {
            data_all: arry,
            cutoff: slider.value
        }
        console.log(selected);

        var filtered_colleges = getColleges(selected);
        filtered_colleges.map((e) => { appendCollege(e["college"]) })

    })




}



function callback(results, status) {
    console.log(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            console.log(results[i].name)
        }
    }
}



function createMarker(place) {
    let cho = document.getElementById("chosen");

    if (!place.geometry || !place.geometry.location) return;


    // const collg = document.createElement("div")
    // collg.innerText = place.name;
    // var parent = document.getElementsByClassName("row")[0]
    // collg.classList.add("college")
    // parent.appendChild(collg)


    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name);
        infowindow.open(map);
        cho.innerText = place.name

    });
}