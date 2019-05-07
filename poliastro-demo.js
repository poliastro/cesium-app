var czml = []; // czml data

// load the czml data
var czmlDataSource = new Cesium.CzmlDataSource();
czmlDataSource.load(czml);

// Set attractor data from custom properties packet
var customPropertyObject = czmlDataSource.entities.getById('custom_properties');
var customAttractor = customPropertyObject.properties.custom_attractor.getValue();

// Initialize the ellipsoid and its repsective imagery
var ellipsoid, imagery;

// If a custom attractor is defined, load the data from the custom packet
if(customAttractor){
    var _ellipsoid = customPropertyObject.properties.ellipsoid.getValue();
    var _imagery = customPropertyObject.properties.map_url.getValue();
    
    ellipsoid = new Cesium.Ellipsoid(_ellipsoid[0], _ellipsoid[1], _ellipsoid[2]);

    imagery = new Cesium.SingleTileImageryProvider({
        ellipsoid: ellipsoid,
        url: Cesium.buildModuleUrl(_imagery)
    });
}

var viewer = new Cesium.Viewer('cesiumContainer', {
    // Set the ellipsoid
    mapProjection: new Cesium.GeographicProjection(ellipsoid),
    imageryProvider: imagery,
});

var scene = viewer.scene;
var handler;

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