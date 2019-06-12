# Poliastro with Cesium

An application to render poliastro orbital data with Cesium.

## Running the application

### Run locally

1.  Create a folder in your target directory

___

2.  Clone the project

``git clone https://github.com/poliastro/cesium-app.git``

___

3. Navigate to ``application``

``cd application``

___

4. If you have a Cesium access token, open ``main.html`` in the editor of your choice

___

5. Find ``Cesium.Ion.defaultAccessToken`` and replace ``'your_access_token'`` with your access token

> **_NOTE:_**  You can get an access token by creating a [Cesium ion account](https://cesium.com/ion/signup/). 
> Alternatively, you can skip this step and use the default token.

___

6. Run ``main.html`` in your browser

___


### Run online

1. Open any application in [Cesium Sandcastle](https://cesiumjs.org/Cesium/Build/Apps/Sandcastle/)

___

2. Copy the contents of ``Sandcastle/js_main.js``

___

3. Paste into the ``Javascript Code`` tab

![js img](https://github.com/poliastro/cesium-app/blob/master/assets/ex_1.png)

___

4. Copy the contents of ``Sandcastle/html_main.html``

___

5. Paste into the ``HTML body & CSS`` tab


![html img](https://github.com/poliastro/cesium-app/blob/master/assets/ex_2.png)

___

6. Run the application

