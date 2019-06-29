<template>
  <div id="app">
    <slider :slides="slidesImg"></slider>
  </div>
</template>

<script>
  import Slider from "./assets/Slider"
  import {slidesImg} from "./slides.js"
export default {
  name: 'app',
  components:{
    Slider
  },
  data () {
    return {
      slidesImg
    }
  }
}
</script>

<style>

</style>
