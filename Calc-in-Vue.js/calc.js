"use strict";

const courses = [
    {
        title: "Товар №1",
        prices: {
            maximum: 36900,
            medium: 19900,
            minimum: 16900
        }
    },

    {
        title: "Товар №2",
        prices: {
            maximum: 36900,
            medium: 19900,
            minimum: 16900
        }
    },

    {
        title: "Товар №3",
        prices: {
            maximum: 18900,
            medium: 12900,
            minimum: 9900
        }
    },

    {
        title: "Товар №4",
        prices: {
            maximum: 36900,
            medium: 24900,
            minimum: 19900
        }
    },

    {
        title: "Товар №5",
        prices: {
            maximum: 12900,
            medium: 7900,
            minimum: 5900
        }
    },
];

const coupons = {
    "LETO": 0.8,
    "STUDENT": 0.95
};

window.addEventListener('load',function(){
    const app = new Vue({
        el:"#discounts",
        data: {
            courses,
            coupons,
            selected : [],
            pushId : [],    //здесь записываем id выбранных товаров
            priceArr:[],
            nootebook : false,
            friend :false,
            promo:'',
            usePromo:false,
            textPromo:'',
            promoDiscount:0,
            result:0,
            promoError: false,
            show:false
        },
        methods: {
            //добавить поменять удалить
            choose(course,price,index){
                if(this.check(index)){  //если товар уже в списке
                    
                    let id = this.pushId.indexOf(index); //ищем индекс товара по индексу в списке выбранных

                    if(this.selected[id].price == price && this.selected[id].title == course.title ){ //удаляем

                        this.selected.splice(id,1);
                        this.pushId.splice(id,1);
                        this.fixPrice();

                    } else {                                                                        
                        this.selected[id].price = price;   // или меняем цену
                        this.fixPrice();
                    }
                   
                } else this.addGood(course,price,index) //если нету товара то добавляем
                
            },
            addGood(course,price,index){
                let obj = { title:course.title, price:price, newPrice: price ,minPrice:course.prices.minimum}
                this.selected.push(obj);
                this.pushId.push(index);
                this.fixPrice(); 
            },
            fixPrice(){ //применяет скидки к товарам
                this.sortPrice(); 
                this.useDiscount();
                this.refresh();
            },
            findIdGood(course){
                return this.priceArr.findIndex(function(item){
                    return item.course == course
                })
            },
            refresh(){
                let sum = 0;
                for(let value of this.selected){
                   let needId = this.findIdGood(value.title);
                   value.newPrice = this.priceArr[needId].price;
                   sum += value.newPrice;
                }
                this.result = sum;
            },
            check(id){
                for(let idCourse of this.pushId){
                    if(idCourse==id){
                        return true
                    }
                }
                return false
            },
            activeClass(course,price){
                let inList = this.selected.some(function(item){
                    return item.title == course.title && item.price == price
                })
                return {"bg-success text-white" : inList}
            },
            oldPriceClass(course){
                return {"sale" : course.price!==course.newPrice}
            },
            useDiscount(){  //логика применения скидок
                if(this.selected.length>0){
                             
                    //Посдедний элемент в сортированном массиве прайсов всегда с максимальной ценой
                    let last = this.priceArr.length-1;
                    let maxPrice = this.priceArr[last].startPrice;
                    let minPrice = this.priceArr[last].minPrice;

                    for(let i = 0; i < this.priceArr.length; i++){  //скидка при выборе нескольких товаров
                        if(i==1){
                            this.priceArr[i].price = this.priceArr[i].price - this.priceArr[i].price * 0.1;
                        }
                        if(i==2){
                            this.priceArr[i].price = this.priceArr[i].price - this.priceArr[i].price * 0.15;
                        }
                        if(i>2){
                            this.priceArr[i].price = this.priceArr[i].price - this.priceArr[i].price * 0.2;
                        }
                    }
                    
                    if(this.friend){   //скидка с другом
                        this.priceArr[last].price = this.priceArr[last].price-this.priceArr[last].price*0.1;
                    }
                    if(this.nootebook && maxPrice!==minPrice){  //скидка при оплате наличными
                        this.priceArr[last].price = this.priceArr[last].price-this.priceArr[last].price*0.1;
                    }
                    if(this.usePromo){ //скидка с использованным промокодом
                        this.priceArr[last].price = this.priceArr[last].price-this.priceArr[last].price * this.promoDiscount; 
                    }
                }  
            },
            setPromo(){
                this.show = true;
                if(this.findPromo){
                    this.usePromo = true;
                    this.textPromo = this.promo;
                    this.fixPrice();
                }
            },
            sortPrice(){
                let sortArr = [];
                for(let value of this.selected){
                    sortArr.push({price : value.price, course : value.title, minPrice : value.minPrice, startPrice : value.price});
                }   
                sortArr.sort(function(a, b) {
                    return a.price - b.price;
                });
                this.priceArr = sortArr;
            }
        },
        computed: {
            findPromo(){
                for(let prop in this.coupons){
                    if(this.promo==prop){
                        this.promoDiscount = this.coupons[prop];
                        return true
                    } 
                }
                this.promoDiscount = 0;
                return false
            }
        }, 
    })
})
