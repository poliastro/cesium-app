var request = new XMLHttpRequest(); //Temporary hack, handling local files in javascript is hard :/
request.open("GET","czml.json", false);
request.send(null);

// load the czml data
var czmlDataSource = new Cesium.CzmlDataSource();
czmlDataSource.load(czml);

// Set attractor data from custom properties packet
var customPropertyObject = czmlDataSource.entities.getById('custom_properties');
var customAttractor = customPropertyObject.properties.custom_attractor.getValue();

// Initialize the ellipsoid and its repsective imagery
var ellipsoid, imagery, Globe;

// If a custom attractor is defined, load the data from the custom packet
if(customAttractor){
    var _ellipsoid = customPropertyObject.properties.ellipsoid.getValue();
    var _imagery = customPropertyObject.properties.map_url.getValue();
    
    ellipsoid = new Cesium.Ellipsoid(_ellipsoid[0], _ellipsoid[1], _ellipsoid[2]);

    imagery = new Cesium.SingleTileImageryProvider({
        ellipsoid: ellipsoid,
        url: Cesium.buildModuleUrl(_imagery)
    });
    
    Globe = new Cesium.Globe(ellipsoid);
}
else {
    Globe = new Cesium.Globe();
}

var viewer = new Cesium.Viewer('cesiumContainer', {
    // Set the ellipsoid
    globe: new Cesium.Globe(ellipsoid),
    imageryProvider: imagery,
    baseLayerPicker: !customAttractor,
});


var scene = viewer.scene;
var handler;

scene.postUpdate.addEventListener(icrf);

// To have an inertial (ICRF) view
function icrf(scene, time) {
    var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
    if (Cesium.defined(icrfToFixed)) {
        var camera = viewer.camera;
        var offset = Cesium.Cartesian3.clone(camera.position);
        var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
        camera.lookAtTransform(transform, offset);
    }
}
 
viewer.camera.flyHome(0);

viewer.dataSources.add(czmlDataSource);