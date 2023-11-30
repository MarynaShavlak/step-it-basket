// const goodList = {
//     products: [
//         {
//             id: 1,
//             title: 'Jumanji',
//             image: 'images/Jumanji.webp',
//             price: 890
//         },
//         {
//             id: 2,
//             title: '13 Minutes',
//             image: 'images/13 Minutes.webp',
//             price: 450
//         },
//         {
//             id: 3,
//             title: 'Aquaman',
//             image: 'images/Aquaman.webp',
//             price: 980
//         },
//         {
//             id: 4,
//             title: 'Venom',
//             image: 'images/Venom.webp',
//             price: 450
//         },
//     ],
//     render(){
//         const parentNode = document.querySelector('.goods');
//         for(let item of this.products){
//             let element = document.createElement('div');
//             element.id = 'good-'+item.id;
//             element.className = 'good';
//             let img = document.createElement('img');
//             img.src = item.image;
//             let title = document.createElement('h3');
//             title.textContent = item.title;
//             let price = document.createElement('p');
//             price.textContent = item.price;
//             price.className = 'good-price';
//             let button = document.createElement('button');
//             button.textContent = 'Купити';
//             element.appendChild(img)
//             element.appendChild(title)
//             element.appendChild(price)
//             element.appendChild(button)
//             parentNode.appendChild(element)
//         }
//     }
// }

// goodList.render()
// const goods = {    
//         id: 4,
//         title: 'Venom',
//         image: 'images/Venom.webp',
//         price: 450               
// }

// const good = new GoodsItem(1, 'Jumanji','images/Jumanji.webp',580);
// console.log(good)

class GoodsItem {
    category = 'Movies'
       constructor(id,title,img,price){
        this.id = id;
        this.title = title;
        this.image = img;
        this.price = price;
       }             
}

class GoodsList{
    products = [
        new GoodsItem(1, 'Jumanji','images/Jumanji.webp',580),
        new GoodsItem(2, '13 Minutes','images/13 Minutes.webp',590),
        new GoodsItem(3, 'Aquaman','images/Aquaman.webp',350),
        new GoodsItem(4, 'Venom','images/Venom.webp',350),
    ]
    constructor(){

    }
    render(){
        const parentNode = document.querySelector('.goods');
        for(let item of this.products){
        let renderGood = new RenderGoods(item.id, item.image, item.title, item.price);
        const renderElement = renderGood.render()
            parentNode.appendChild(renderElement)
        }
    }
    }

class RenderGoods{
    constructor(id, image, title, price){
        this.id = id;
        this.image = image;
        this.title = title;
        this.price = price;
    }
   render(){
    let element = document.createElement('div');
    element.id = 'good-'+this.id;
    element.className = 'good';
    let img = document.createElement('img');
    img.src = this.image;
    let title = document.createElement('h3');
    title.textContent = this.title;
    let price = document.createElement('p');
    price.textContent = this.price + 'uah';
    price.className = 'good-price';
    let button = document.createElement('button');
    button.textContent = 'Купити';
    button.addEventListener('click', this.addGoodCart.bind(this))


    element.appendChild(img)
    element.appendChild(title)
    element.appendChild(price)
    element.appendChild(button)
    return element
   }

   addGoodCart(){
    shop.cart.update(this)
   }
}
class Cart{
    constructor(){
        this.goodsInCart = [];
        this.totalPrice = 0;
    }
    update(good){
       this.goodsInCart.push(good);
       this.totalPrice = this.totalPrice + good.price; 
    //    console.log(this)
    let cartElement = document.querySelector('.cart');
    cartElement.querySelector('.goods-in-cart span').innerHTML = this.goodsInCart.length;
    cartElement.querySelector('.total-price span').innerHTML = this.totalPrice;
    }
}

class Shop{
    goodList = new GoodsList()
    cart = new Cart()
constructor(){}
render(){
    this.goodList.render()
}
}

const shop = new Shop()
shop.render()
