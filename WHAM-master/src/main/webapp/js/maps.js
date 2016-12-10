﻿var distanceF;
var initialLocation;
var zoom = [];
function init(checked) {
    //set options for map
    var mapDiv = document.getElementById("myMap");
    var input = document.getElementById('pac-input');
    var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14
    };

    var map = new google.maps.Map(mapDiv, options);

    // get current location of the user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pinImage = {
                url: '../images/blue_dot_circle.png'
            };
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);

            // set marker for user's current location
            var marker = new google.maps.Marker({
                position: map.getCenter(),
                icon: pinImage,
                title: "You are here",
                map: map
            });

            // add search box 
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function () {
                searchBox.setBounds(map.getBounds());
            });

            // Add searchbox event. Change bounds when user adds a location
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function (place) {
                    bounds.extend(place.geometry.location);
                });
                map.fitBounds(bounds);
            });

            // get host name and port number of current host to create the api url
            var url = window.location.href;
            var arr = url.split("/");
            // get user ID
            var ID = sessionStorage.getItem("id") || "";
            if (checked && ID !== "") {
                var api_url = "http://" + arr[2] + "/WHAM/datasource/" + position.coords.latitude + "/" + position.coords.longitude + "/10/?userId=" + ID;
            } else {
                var api_url = "http://" + "ec2-52-87-159-69.compute-1.amazonaws.com:8080" + "/WHAM/datasource/" + position.coords.latitude + "/" + position.coords.longitude + "/10";
            }

            // api call
            $.get({ url: api_url }, function (data) {
                var loc = data || [];

                //loc.push({ "eventName": "Dummy event @ MIT3", extLink: "www.abc1.com", "eventDesc": "001", "eventLocation": null, "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": null, "startTime": null, "endTime": 1459389600000, "latitude": 42.3601, "longitude": -71.0942, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": true });
                //loc.push({ "eventName": "Dummy event @ some", extLink: null, "eventDesc": "007", "eventLocation": "239 Holland Street null Somerville MA 02144 US", "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": 1459389600000, "startTime": null, "endTime": 1459389600000, "latitude": 42.3351, "longitude": -71.1704, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": true });
                //loc.push({ "eventName": "Dummy event @ MIT", extLink: null, "eventDesc": "002", "eventLocation": "MIT", "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": 1459389600000, "startTime": null, "endTime": 1459389600000, "latitude": 42.3601, "longitude": -71.0942, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": false });
                //loc.push({ "eventName": "Dummy event @ some2", extLink: null, "eventDesc": "003", "eventLocation": "239 Holland Street null Somerville MA 02144 US", "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": 1459389600000, "startTime": null, "endTime": 1459389600000, "latitude": 42.3351, "longitude": -71.1704, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": false });
                //loc.push({ "eventName": "Dummy event @ MIT2", extLink: null, "eventDesc": "004", "eventLocation": "MIT", "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": 1459389600000, "startTime": null, "endTime": 1459389600000, "latitude": 42.3601, "longitude": -71.0942, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": true });
                //loc.push({ "eventName": "Dummy event @ framingham", extLink: null, "eventDesc": "005", "eventLocation": "MIT", "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": 1459389600000, "startTime": null, "endTime": 1459389600000, "latitude": 42.3770, "longitude": -71.1167, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": true });
                //loc.push({ "eventName": "Dummy event @ fram", extLink: "www.abc.com", "eventDesc": "006", "eventLocation": null, "phoneNumber": null, "emailId": null, "startDate": 1459296000000, "endDate": 1459389600000, "startDateAndTime": 1459296000000, "endDateAndTime": null, "startTime": null, "endTime": 1459389600000, "latitude": 42.3505, "longitude": -71.1054, "filePath": null, "organiserName": null, "organiserDesc": null, "creationTime": 1458585314000, "lastUpdateTime": 1458585503000, "officialEvent": false });

                // display number of envents
                var div = document.getElementById('total');
                div.innerHTML = 'There are total ' + loc.length + ' events happening arround you!!!!!';

                // make map responsive
                google.maps.event.addDomListener(window, "resize", function () {
                    var center = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);
                });

                // image for the marker
                var image = {
                    url: '../images/paw_pin.png'
                };

                // iterate through each event and it to the marker
                for (var i = 0; i < loc.length; i++) {
                    var count = 0;
                    // hold multiple events happening on same location
                    var hold = [];

                    // find multiple events on same location
                    for (var j = 0; j < loc.length; j++) {
                        if (loc[i].latitude === loc[j].latitude && loc[i].longitude === loc[j].longitude) {
                            count++;
                            hold.push(loc[j]);
                        }
                    }
                    var event_type = loc[i].officialEvent;

                    // for multiple events on same location
                    if (count > 1) {
                        // different marker pin
                        var multiimage = new google.maps.MarkerImage("http://maps.google.com/mapfiles/kml/pal4/icon50.png");
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(loc[i].latitude, loc[i].longitude),//locations[i].latlng,
                            icon: multiimage,
                            map: map,
                            title: loc[i].eventName
                        });

                    }
                        // Else
                    else {
                        if (event_type) {
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(loc[i].latitude, loc[i].longitude),//locations[i].latlng,
                                icon: image,
                                map: map,
                                title: loc[i].eventName
                            });
                        } else {
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(loc[i].latitude, loc[i].longitude),//locations[i].latlng,
                                map: map,
                                title: loc[i].eventName
                            });
                        }
                    }

                    var infowindow = new google.maps.InfoWindow();

                    // find distance between user's current location and event
                    distanceF = (google.maps.geometry.spherical.computeDistanceBetween(initialLocation, new google.maps.LatLng(loc[i].latitude, loc[i].longitude))) / 1609.34;
                    var distance = distanceF.toFixed(1);

                    // format the date
                    var start = new Date(loc[i].startDateAndTime);
                    var end = new Date(loc[i].endDateAndTime);
                    function convert(h, ampm) {
                        if (h >= 12) {
                            h = h - 12;
                            ampm = "PM";
                        }
                        return (h + ":00 " + ampm);
                    }

                    // generate date and time string in desired format
                    var h1 = convert(start.getHours(), "AM");
                    var h2 = convert(end.getHours(), "AM");
                    var startTime = start.getTime();
                    var start_date_time = (start.getMonth() + 1) + "/" + start.getDate() + "/" + start.getFullYear() + " " + h1;
                    var end_date_time = (end.getMonth() + 1) + "/" + end.getDate() + "/" + end.getFullYear() + " " + h2;

                    // if multiple events are happening in same location content would be different
                    if (count > 1) {
                        var content = "";
                        var content_modal = "";
                        for (var k = 0; k < hold.length && count > 0; k++) {
                            // date format
                            var start1 = new Date(hold[k].startDateAndTime);
                            var end1 = new Date(hold[k].endDateAndTime);
                            var h11 = convert(start1.getHours(), "AM");
                            var h21 = convert(end1.getHours(), "AM");
                            var start_date_time1 = (start1.getMonth() + 1) + "/" + start1.getDate() + "/" + start1.getFullYear() + " " + h11;
                            var end_date_time1 = (end1.getMonth() + 1) + "/" + end1.getDate() + "/" + end1.getFullYear() + " " + h21;

                            /* for applying different classes to alternate events 
                             happening on same location so that we can give different color background */
                            if (k % 2 == 0) {
                                content = content + "<div class='sect'>";
                            } else {
                                content = content + "<div class='sect1'>";
                            }

                            // setting content
                            content += "<br/>Name: " + hold[k].eventName
                            + "<br/>";
                            if (hold[k].eventLocation != null) {
                                content = content + "Event Location: " + hold[k].eventLocation + "<br/>"
                            }
                            content = content + "Distance: " + distance + " miles" + "<br/>" +
                                "Start Time: " + start_date_time1 + "<br/>";
                            if (hold[k].endDateAndTime != null) {
                                content = content + "End Time: " + end_date_time1 + "<br/>";
                            }
                            if (hold[k].extLink != null) {
                                var anc = "<a href='" + hold[k].extLink + "' target = '_blank'>Click for more details </a>"
                                content = content + anc + "<br/>";
                            }

                                // modal thingie
                            else {
                                var modal_link1 = "More Details: " + "<a href = '#'" + "class='" + k + "' data-toggle='modal' data-target ='#infoModal' onClick = 'show(" + k + ")'>" + "Click Here" + "</a>";
                                content = content + modal_link1 + "<br/>";

                                // set the content for modal
                                content_modal = content_modal + "<div class='multi_modal " + k + "part' style='display:none'>";
                                content_modal += getString(hold[k].eventName, hold[k].eventDesc, hold[k].eventLocation, distance, hold[k].organiserName, hold[k].organiserDesc, hold[k].phoneNumber, hold[k].emailId, start_date_time1, end_date_time1);
                                content_modal += "</div>";
                            }

                            if (hold[k].officialEvent) {
                                content = content + "<img src='../images/paw.jpg' alt='Smiley face' height='25' width='25' title='NEU official event'>";
                            }
                            content = content + "<br/></div>"
                            count--;
                        }
                        content = "<div class=info>" + content + "</div>";
                    }
                    else {
                        var content = "Name: " + loc[i].eventName
                        + "<br/>";
                        if (loc[i].eventLocation != null) {
                            content = content + "Event Location: " + loc[i].eventLocation + "<br/>"
                        }
                        content = content + "Distance: " + distance + " miles" + "<br/>" +
                            "Start Time: " + start_date_time + "<br/>";
                        if (loc[i].endDateAndTime != null) {
                            content = content + "End Time: " + end_date_time + "<br/>";
                        }
                        if (loc[i].extLink != null) {
                            var a = "<a href='" + loc[i].extLink + "' target = '_blank'>Click for more details </a>"
                            content = content + a + "<br/>";
                        }

                            // Modal thingie
                        else {
                            var modal_link = "More Details: " + "<a href = '#'" + " data-toggle='modal' data-target ='#infoModal'>" + "Click Here" + "</a>";
                            content = content + modal_link + "<br/>";
                            var content_modal = getString(loc[i].eventName, loc[i].eventDesc, loc[i].eventLocation, distance, loc[i].organiserName, loc[i].organiserDesc, loc[i].phoneNumber, loc[i].emailId, start_date_time, end_date_time);
                        }

                        if (event_type)
                            content = content + "<img src='../images/paw.jpg' alt='Smiley face' height='25' width='25' title='NEU official event'>";
                        content = content + "<br/>"
                    }

                    var currentInfoWindow = null;
                    google.maps.event.addListener(marker, 'click', (function (marker, content, content_modal, infowindow) {
                        return function () {
                            infowindow.setContent(content);
                            if (currentInfoWindow != null) {
                                currentInfoWindow.close();
                            }
                            infowindow.open(map, marker);
                            currentInfoWindow = infowindow;

                            // adding modal content in info window so that every pin will show content related to that pin
                            var modalDiv = document.getElementById('details');
                            modalDiv.innerHTML = content_modal;
                        };
                    })(marker, content, content_modal, infowindow));
                } // end of for loop
            });// end of api call
        });// end of navigator
    }
}

/* apply method will apply user's preferences based on whether check box is selected or not.
That is if user wants to apply his preferences on event search or not
*/
function apply() {
    if (document.getElementById("check").checked) {
        init(true);
    } else {
        init(false);
    }
}
window.onload = apply;

/* This function is for showing single event detail in modal when multiple 
events details are in same info window*/
function show(k) {
    var elements = document.getElementsByClassName('multi_modal');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
    var nameClass = k + "part";
    document.getElementsByClassName(nameClass)[0].style.display = 'block';
}

function set_zoom() {
    zoom = [42.3398, -71.0892];
    apply();
    if (zoom.length == 2) {

        bounds = new google.maps.LatLngBounds();

        var z = new google.maps.LatLng(zoom[0], zoom[1]);
        bounds.extend(z);

        map.fitBounds(bounds);
        map.panToBounds(bounds);
    }
}

function getString(eventName, eventDesc, eventLocation, distance, organiserName, organiserDesc, phoneNumber, emailId, start_date_time1, end_date_time1) {
    if (eventName == null) {
        eventName = "Information not available";
    }
    if (eventLocation == null) {
        eventLocation = "Information not available";
    }
    if (organiserName == null) {
        organiserName = "Information not available";
    }
    if (organiserDesc == null) {
        organiserDesc = "Information not available";
    }
    if (phoneNumber == null) {
        phoneNumber = "Information not available";
    }
    if (emailId == null) {
        emailId = "Information not available";
    }
    var tempString = "<b>Event Name: " + "</b>" + eventName + "<br/>" + "<b>Event Description: " + "</b>" + eventDesc + "<br/>" + "<b>Event Location: " + "</b>" + eventLocation + "<br/>" + "<b>Distance: " + "</b>" + distance + "miles" + "<br/>" + "<b>Organiser(s): " + "</b>" + organiserName + "<br/>" + "<b>Organiser Description: " + "</b>" + organiserDesc + "<br>" + "<b>Email ID: " + "</b>" + emailId + "<br/>" + "<b>Phone: " + "</b>" + phoneNumber + "<br/>" + "<b>Event Start Time: " + "</b>" + start_date_time1 + "<br/>" + "<b>Event End Time: " + "</b>" + end_date_time1 + "<br/>";
    return tempString;
}