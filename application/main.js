// TODO: This needs a major refactor
// Get rid of the global variables and introduce better error handling

var init_ = false;
var czml = [];
var czmlDataSource;
var scene, handler;
var customPropertyObject, customAttractor;
var ellipsoid, imagery, Globe;

// Handle file upload
var inputElement = document.querySelector("#file-input");
inputElement.addEventListener("change", handleFiles, false);

// Handle gif creation
document.getElementById("screenshot").addEventListener("click", handle_screenshot);

function handle_screenshot() {
  viewer.render();
  var canvas = viewer.canvas;
  var img_data = canvas.toDataURL();
  var url = img_data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
  window.open(url);
}

function handleFiles() {
    // Reset view
    viewer.dataSources.removeAll();

    // Read file
    var reader = new FileReader();
    reader.onload = function(event) {
        czml = JSON.parse(event.target.result);
        
        // Add czml
        czmlDataSource = new Cesium.CzmlDataSource();
        czmlDataSource.load(czml);

        customPropertyObject = czmlDataSource.entities.getById('custom_properties');
        customAttractor = customPropertyObject.properties.custom_attractor.getValue();
        if (customAttractor) {
            // Parse custom properties
            setCustomProperties();
            // Parse orbital data
            viewer.dataSources.add(czmlDataSource);
        }
    };

    reader.onerror = function(event) {
        console.log(event.target.error);
    };

    reader.readAsText(this.files[0]);
}

// Camera flags
var cameraflags = {
    mvW: false,
    mvA: false,
    mvS: false,
    mvD: false,
    mvE: false,
    mvQ: false
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

function cameraControl(clock) {
    var camera = viewer.camera;

    // TODO: Better way to change speed
    // Maybe modify the speed with the slider?

    var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    var cameraMoveSpeed = 0.01;

    if (cameraflags.mvE && !cameraflags.mvQ) {
        camera.moveUp(cameraMoveSpeed * cameraHeight);
    } else if (cameraflags.mvQ) {
        camera.moveDown(cameraMoveSpeed * cameraHeight);
    }

    if (cameraflags.mvW && !cameraflags.mvS) {
        camera.moveForward(cameraMoveSpeed * cameraHeight);
    } else if (cameraflags.mvS) {
        camera.moveBackward(cameraMoveSpeed * cameraHeight);
    }

    if (cameraflags.mvD && !cameraflags.mvA) {
        camera.moveRight(cameraMoveSpeed * cameraHeight);
    } else if (cameraflags.mvA) {
        camera.moveLeft(cameraMoveSpeed * cameraHeight);
    }
}

var viewer = new Cesium.Viewer('cesiumContainer', {
    // Set the ellipsoid
    globe: new Cesium.Globe(ellipsoid),
    imageryProvider: imagery,
    baseLayerPicker: !customAttractor,
});

// If a custom attractor is defined, load the data from the custom packet
function setCustomProperties() {
    viewer.destroy();
    
    var _scene = Cesium.SceneMode.SCENE3D;
    
	var _ellipsoid = customPropertyObject.properties.ellipsoid.getValue();
    
	var _imagery = customPropertyObject.properties.map_url.getValue();
	
	if (!customPropertyObject.properties.scene3D.getValue()) {
		_scene = Cesium.SceneMode.SCENE2D;
	}
	
    ellipsoid = new Cesium.Ellipsoid(_ellipsoid[0], _ellipsoid[1], _ellipsoid[2]);
    
	var _tiling_scheme = new Cesium.WebMercatorTilingScheme({
		ellipsoid: ellipsoid
	});
	
	var terrainProvider = new Cesium.EllipsoidTerrainProvider({
		tilingScheme: _tiling_scheme,
		ellipsoid: ellipsoid
	});
	
    imagery = new Cesium.SingleTileImageryProvider({
        ellipsoid: ellipsoid,
        url: Cesium.buildModuleUrl(_imagery)
    });


    Globe = new Cesium.Globe(ellipsoid);

    viewer = new Cesium.Viewer('cesiumContainer', {
        // Set the ellipsoid
        globe: new Cesium.Globe(ellipsoid),
        imageryProvider: imagery,
		terrainProvider: terrainProvider,
		sceneMode: _scene,
    });

    scene = viewer.scene;
	
	if (customPropertyObject.properties.scene3D.getValue()) {
		viewer.scene.postUpdate.addEventListener(icrf);
		viewer.scene.postUpdate.addEventListener(cameraControl);
	}
}

scene = viewer.scene;

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
