var czml = []; // czml data

// load the czml data
var czmlDataSource = new Cesium.CzmlDataSource();
czmlDataSource.load(czml);

// Set attractor data from custom properties packet
var customPropertyObject = czmlDataSource.entities.getById('custom_properties');
var customAttractor = customPropertyObject.properties.custom_attractor.getValue();

// Initialize the ellipsoid and its repsective imagery
var ellipsoid, imagery, Globe;

// Camera flags
var cameraflags = {
    mvW : false,
    mvA : false,
    mvS : false,
    mvD : false,
    mvE : false,
    mvQ : false
};

function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
        case 'W'.charCodeAt(0):
            return 'mvW';
        case 'S'.charCodeAt(0):
            return 'mvS';
        case 'D'.charCodeAt(0):
            return 'mvD';
        case 'A'.charCodeAt(0):
            return 'mvA';
        case 'Q'.charCodeAt(0):
            return 'mvQ';
        case 'E'.charCodeAt(0):
            return 'mvE';
        default:
            return undefined;
    }
}

document.addEventListener('keydown', function(e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        cameraflags[flagName] = true;
    }
}, false);
 
document.addEventListener('keyup', function(e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        cameraflags[flagName] = false;
    }
}, false);
 

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

viewer.clock.onTick.addEventListener(function(clock) {
    var camera = viewer.camera;

    // TODO: Better way to change speed
    // Maybe modify the speed with the slider?
    
    var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    var cameraMoveSpeed = 0.01;
    
    if (cameraflags.mvE && !cameraflags.mvQ) {
        camera.moveUp(cameraMoveSpeed * cameraHeight);
    }
    else if (cameraflags.mvQ) {
        camera.moveDown(cameraMoveSpeed * cameraHeight);
    }
    
    if (cameraflags.mvW && !cameraflags.mvS) {
        camera.moveForward(cameraMoveSpeed * cameraHeight);
    }
    else if (cameraflags.mvS) {
        camera.moveBackward(cameraMoveSpeed * cameraHeight);
    }
    
    if (cameraflags.mvD && !cameraflags.mvA) {
        camera.moveRight(cameraMoveSpeed * cameraHeight);
    }
    else if (cameraflags.mvA) {
        camera.moveLeft(cameraMoveSpeed * cameraHeight);
    }
    
});