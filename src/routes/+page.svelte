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

    let displayTrackedCats = true;
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
  <div class="sidebar" style="gap: 10px;">
    <center>
      <div class="mapbox-directions-profile mapbox-directions-component-keyline mapbox-directions-clearfix">
        <input id="mapbox-directions-profile-driving-traffic" type="radio" name="profile" value="mapbox/driving-traffic" checked="true">
        <label for="mapbox-directions-profile-driving-traffic" style="width: 8.65vw;" on:click={() => displayTrackedCats = true}>Tracked Cats</label>
        <input id="mapbox-directions-profile-cycling" type="radio" name="profile" value="mapbox/cycling">
        <label for="mapbox-directions-profile-cycling" style="width: 8.65vw;" on:click={() => displayTrackedCats = false}>Found a Cat?</label>
      </div>
    </center>
    <br>
    <div class="sidesection">
        {#if displayTrackedCats}
            <center>
                <h2>Cats We FEED</h2>
                <table>
                <tr>
                    <th>Name</th>
                    <th>Time Since Last Fed</th>
                </tr>
                <tr>
                    <td>Emma</td>
                    <td><b>15 hours</b></td>
                </tr>
                </table>
            </center>
        {:else}
            <FoundCat/>
        {/if}
    </div>
  </div>
</div>

<style>

.sidebar {
    margin: 1vw;
    position: relative;
    width: 19vw;
}
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

  .sidesection {
    background-color: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
  }
</style>