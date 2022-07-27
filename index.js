$.ajax({
  type: "GET",
  url: "https://api.data.gov.sg/v1/environment/psi",
  contentType: "application/json; charset=utf-8",
  dataType: "json",
  success: function (response) {
    var regionMetadata = response.region_metadata;
    var psiDailyData = response.items[0].readings.pm10_twenty_four_hourly;
    console.log(psiDailyData);

    var center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
    var map = L.map("mapdiv").setView([center.x, center.y], 12);

    L.Icon.Default.imagePath =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/images";

    var basemap = L.tileLayer(
      "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",
      {
        detectRetina: true,
        maxZoom: 18,
        minZoom: 11,
        attribution:
          '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;">' +
          'New OneMap | Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
      }
    );

    $.each(regionMetadata, function (index, value) {
      var radius = 50;

      if (value.name != "national") {
        var regionLat = value.label_location.latitude;
        var regionLong = value.label_location.longitude;
        var regionName = value.name;
        var psiValue = psiDailyData[regionName];
        var circle = L.circleMarker(
          [parseFloat(regionLat), parseFloat(regionLong)],
          {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.2,
            radius: radius,
          }
        )
          .bindTooltip(`${psiValue}`, {
            permanent: true,
            direction: "center",
            className: "centerLabel",
          })
          .addTo(map);
      }
    });

    map.setMaxBounds([
      [1.56073, 104.1147],
      [1.16, 103.502],
    ]);

    basemap.addTo(map);
  },
});
