<svelte:head>
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />
    <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.js'></script>
    <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css' type='text/css' />
</svelte:head>

<script lang="ts">
    import '../app.postcss'
    import {onMount} from 'svelte'
    import mapboxgl from 'mapbox-gl';
	import FoundCat from '$lib/views/FoundCat.svelte';

    // let map: mapboxgl.Map;
    
    onMount(async() => {
      mapboxgl.accessToken = "pk.eyJ1IjoidHdpbmtsZWJ1bnoxMDciLCJhIjoiY2xoMmFoMWl2MWF5YjNzbXB2amc3NmdiaiJ9.TtL3czNMJqBCphmq2_arqg"
      
      const map = new mapboxgl.Map({
          container: 'mapcontainer',
          style: 'mapbox://styles/mapbox/streets-v12', 
          center: [0, 0], 
          zoom: 3
      })
      
      let userLocation: mapboxgl.LngLatLike;

      navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {enableHighAccuracy: true});

      function successLocation (position: GeolocationPosition) {
          let lat = position.coords.latitude;
          let long = position.coords.longitude;
        
          userLocation = [long, lat]
          map.flyTo({center: userLocation, zoom: 13})
      }

      function errorLocation (e: GeolocationPositionError) {
          console.log(e)
      }

        
    })
      
    
   

    


</script>

<div>
  <div id="mapcontainer"></div>
  <div class="menu" style="">
    <FoundCat/>
  </div>
</div>

<style>
  #mapcontainer { 
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%; 
  }

  .menu {
    position: relative;
    width: 20%;
    padding: 1% 3% 1% 1%;
    height: 100vh;
    background-color: white;
  }

  .ml-icon {
    color: var(--accent500);
  }
</style>