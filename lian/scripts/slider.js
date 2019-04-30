function DoSlider() {
    var slider = $(".slider__slides");
            var slide = $(".slider__item");
            var prevBtn = $(".prev");
            var nextBtn = $(".next");
            var slidesArr = [];
            var triggerSlide = 0;
            var rangeIndex = 0;
            var autoPlay;
            var timer;
            var currentSlide = 0;

            function changeSliderLink() {

                if(currentSlide > slide.length-1){
                    currentSlide = 0;
                    $(".slider__link").eq(slide.length-1).removeClass("slider__link_active");
                }
                if(currentSlide<0){
                    currentSlide = slide.length-1;
                    $(".slider__link").eq(0).removeClass("slider__link_active");
                }
                $(".slider__link").eq(currentSlide).toggleClass("slider__link_active");
                $(".slider__link").eq(currentSlide-1).removeClass("slider__link_active");
                $(".slider__link").eq(currentSlide+1).removeClass("slider__link_active");

            }

            for(var i = 0; i < slide.length; i++){
                slidesArr[i]={
                    elem:slide.eq(i),
                    left:0,
                    index:i
                };
                $("<div>", {class: "slider__link"})
                        .appendTo(".slider__nav")
                        .attr("data-number",i)
                        .click(function () {
                            var current = $(this).data("number");
                            findSlide(current);
                        });

            }

            $(".slider__link").eq(0).toggleClass("slider__link_active");

            function findSlide(a){
                for(var t = 0;t<slidesArr.length;t++){
                    if(slidesArr[triggerSlide].index!==a) MoveNext();
                    else break;
                }

            }

            $(window).resize(function () {
                slider.removeClass("slider__slides_animated");
                refreshLeft();
                slider.css("left",rangeIndex * slider.width());
                setTimeout(function () {
                    slider.addClass("slider__slides_animated");
                },10)
            });

            function refreshLeft() {

                    for(var z=0;z<slidesArr.length;z++){
                        var refPos = slider.width() * slidesArr.length * slidesArr[z].left;
                        slidesArr[z].elem.css("left",refPos);
                    }
            }

            function MoveSlide(dir){

                if(dir=="next"){
                    var left = rangeIndex * slide.width() - slide.width();
                    slider.css("left",left);
                    rangeIndex--;
                    currentSlide++;

                }
                if(dir=="prev"){

                    var left = rangeIndex * slide.width() + slide.width();
                    slider.css("left",left);
                    rangeIndex++;
                    currentSlide--;
                }
                changeSliderLink();
            }

            function MoveLeftReverse(){
                AddSlideLeft();
                MoveSlide("prev");
            }

            function MoveRightReverse(){
                AddSlideRight();
                MoveSlide("next");
            }

            function AddSlideLeft(){
                //На сколько нужно сместить последний слайд для перестановки
                    if(slidesArr[slidesArr.length - 1].left <= 0) {
                        var left = slidesArr[slidesArr.length - 1].left * slide.width() * slide.length;
                        var pos = -slide.width() * slide.length + left;
                    }

                    if(slidesArr[slidesArr.length - 1].left > 0) {
                        var left = slidesArr[slidesArr.length - 1].left * slide.width() * slide.length;
                        var pos = left - slide.width() * slide.length;
                    }

                //Переместить последний вначало
                slidesArr[slidesArr.length - 1].elem.css("left",pos);

                //Сохранить текущую позицию
                if(slidesArr[slidesArr.length - 1].left <= 0){
                    slidesArr[slidesArr.length - 1].left--;
                }
                if(slidesArr[slidesArr.length - 1].left > 0) {
                    slidesArr[slidesArr.length - 1].left--;
                }

                //Удалить последний элемент в массиве и добавить его вначало    
                var temp = slidesArr.pop();
                slidesArr.unshift(temp);
            }
            
            function AddSlideRight(){
                //На сколько нужно сместить первый слайд для перестановки
                    var left = slidesArr[0].left * slide.width() * slide.length;
                    var pos = left + slide.width() * slide.length;
                    
                //Переместить первый слайд в конец
                slidesArr[0].elem.css("left",pos);

                //Сохранить текущую позицию
                slidesArr[0].left++;

                //Удалить последний элемент в массиве и добавить его вначало    
                var temp = slidesArr.shift();
                slidesArr.push(temp);
            }

            function stopAutoPlay(){
                clearInterval(autoPlay);
                clearTimeout(timer);
                timer = setTimeout(startAutoPlay,5000);
            }

            prevBtn.click(function() {
                stopAutoPlay();
                if(triggerSlide>0){
                    triggerSlide--;
                    MoveSlide("prev");
                } else {
                    MoveLeftReverse();
                }

            });

            function MoveNext() {
                if(triggerSlide<slidesArr.length-1){
                    triggerSlide++;
                    MoveSlide("next");
                } else {
                    MoveRightReverse();
                }

            }

            nextBtn.click(function() {
                stopAutoPlay();
                MoveNext();
            });

            function startAutoPlay() {
                autoPlay = setInterval(MoveNext,1000);
            }
            // startAutoPlay();

        
}