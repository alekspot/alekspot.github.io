<template>
    <div class="slider" ref="slider">
        <ul class="slides" :class="{'slides_animate':animate}" :style="sliderLeft">
            <li v-for="(slide,key,index) in sl" :style="styleSlide(slide)" class="slide">
                <img :src="slide.img" alt="">
            </li>
        </ul>
        <button class="prev" @click="prev">&#8249;</button>
        <div class="slider__nav">
            <div :class="['slider__tab',n-1==currentSlide ? 'slider__tab_active' : '']" v-for="n in sl.length" @click="moveTo(n-1)"></div>
        </div>
        <button class="next" @click="next">&#8250;</button>
    </div>
</template>

<script>
    import Vue from 'vue'
    var bus = new Vue();
    export default {
        name: "Slider",
        props:{
          slides:Array
        },
        data() {
            return {
                sl:this.slides,
                sliderPos : 0,
                trigger : 0,
                currentSlide : 0,
                moveRight : 0,
                moveLeft : this.slides.length-1,
                interval : null,
                width : 0,
                step : 0,
                animate : true
            }
        },
        methods:{
            next:function(){
                this.sliderPos -= this.width;
                this.trigger++;
                this.currentSlide++;
                this.step++;
                this.triggerControl();
                this.slideControl();
                this.moveControl();
            },
            prev:function(){
                this.sliderPos += this.width;
                this.trigger--;
                this.currentSlide--;
                this.step--;
                this.triggerControl();
                this.slideControl();
                this.moveControl();
            },
            triggerControl:function(){

                if(this.trigger > this.sl.length-1) {
                    this.trigger=this.sl.length-1;

                    //Контролируем какой слайд премещаем влево
                    if(this.moveLeft >= this.slides.length-1){
                        this.moveLeft = 0;
                    } else this.moveLeft++

                    this.addRight();
                }
                //если закончились слайды слева
                if(this.trigger < 0) {
                    this.trigger = 0;

                    //Контролируем какой слайд премещаем вправо
                    if(this.moveRight == 0){
                        this.moveRight = this.slides.length-1;
                    } else this.moveRight--

                    this.addLeft();
                }
            },
            slideControl:function() {
                if(this.currentSlide > this.sl.length-1) {
                    this.currentSlide = 0;
                }
                if(this.currentSlide < 0) {
                    this.currentSlide = this.sl.length-1;
                }
            },
            moveControl:function() {
                if(this.moveRight>this.sl.length-1){
                    this.moveRight=0;
                }
                if(this.moveLeft<0){
                    this.moveLeft=this.sl.length-1;
                }
            },
            addLeft:function(){
                this.sl[this.moveLeft--].left--;
            },
            addRight:function(){
                this.sl[this.moveRight++].left++;
            },
            moveTo:function(n) {
                if(n > this.currentSlide){
                    while(this.currentSlide!=n){
                        this.next();
                    }
                }
                if(n < this.currentSlide){
                    while(this.currentSlide!=n){
                        this.prev();
                    }
                }
            },
            autoPlay:function(){
                this.interval = setInterval(this.next,2000);
            },
            styleSlide:function(slide){
                return {
                    left : slide.left * this.sl.length * this.width + 'px'
                    // background : 'url(' + slide.img + ')'
                }
            },
            callResize:function() {
                bus.$emit('sizeChange');
            },
            resizeSlides:function(){
                this.animate = false;
                this.width = this.$refs.slider.offsetWidth;
                this.sliderPos = -this.step * this.width;
                var self = this;
                setTimeout(function(){
                    self.animate = true;
                },10);
            }
        },
        computed:{
            sliderLeft:function(){
                return {left : this.sliderPos + 'px'}
            }
        },
        mounted(){
            this.width = this.$refs.slider.offsetWidth;
            window.onresize = (event) => {
                this.callResize();
            };
        },
        created(){
            bus.$on('sizeChange',this.resizeSlides)
        }
    }
</script>

<style scoped>
    .slider {
        overflow: hidden;
        max-width: 800px;
        position: relative;
    }
    .slides {
        display: flex;
        position : relative;
        margin: 0;
        padding: 0;
    }
    .slides_animate {
        transition: .6s;
    }
    .slider__nav {
        position: absolute;
        display: flex;
        justify-content: space-around;
        width: 30%;
        bottom:5%;
    }
    .slider__tab{
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 50%;
    }
    .slider__tab_active{
        background: red;
    }
    .slide {
        position: relative;
        flex: 0 0 100%;
        list-style: none;
        font-size: 80px;
        text-align: center;
        padding: 1% 0;
        background-size: cover !important;
        color:#fff;
        line-height: 0;
    }
    .next,.prev {
        position: absolute;
        top:45%;
        margin: 0 20px;
        font-size: 50px;
        border:none;
        color:#fff;
        background: none;
    }
    .next{
        right: 0;
    }
    .slide img {
        max-width: 100%;
    }
</style>