/*=== Alert ===*/
// https://www.jqueryscript.net/demo/Mobile-friendly-Dialog-Toast-Plugin-With-jQuery-alert-js/
!function ($) {
    $._isalert=0,
        $.alert=function(){
            if(arguments.length){
                $._isalert=1;
                return $.confirm.apply($,arguments);
            }
        },
        $.confirm=function(){
            let args=arguments;
            if(args.length){
                let d =$('<div class="alert_overlay esc"></div><div class="alert_msg esc"><div class="alert_content">'+args[0]+'</div><div class="alert_buttons"><button class="alert_btn alert_btn_ok">Да</button><button class="alert_btn alert_btn_cancel">Отмена</button></div></div>'),
                    fn=args[1],
                    flag=1,
                    _click = function(e){
                        typeof fn=='function'?(fn.call(d,e.data.r)!=!1&&d.remove()):d.remove();
                    };
                $._isalert&&d.find('.alert_btn_cancel').hide();
                d.on('contextmenu',!1)
                d.on('contextmenu',!1)
                    .on('click','.alert_btn_ok',{r:!0},_click)
                    .on('click','.alert_btn_cancel',{r:!1},_click)
                    .appendTo('body');
            }
            $._isalert=0;
        },
        $.tips=function(m){
            $('.alert_tips').remove();
            $('<div class="alert_tips"><div>'+m+'</div></div>').appendTo('body').one('webkitAnimationEnd animationEnd',function(){$(this).remove()})
        }
}($);

$(function(){

    /**
     * @name СТАНДАРТНЫЕ ФУНКЦИИ И НАСТРОЙКИ
     * =====================================
     * =====================================
     * */

    let url = window.location.href;
    let config = JSON.parse(localStorage.getItem("config"));
    let priceInt = true;

    // убираем мини-корзину если мы на странице оформления заказа
    if($("#cart_full").length > 0) $('#cart_min, #ks_goods').remove();


    function saleTest(config, total_goods){
        let sale = '';
        if(config.sale != undefined){
            sale = JSON.parse(config.sale);
            $(".price_sale").remove();
            for(let s in sale["sale_price"]){
                let sale_percent = parseInt(sale["sale_percent"][s]);
                let sale_price = parseInt(sale["sale_price"][s]);
                if(total_goods >= sale_price){
                    let new_total_goods = total_goods - (total_goods * sale_percent / 100);
                    $(".ks_total_cart").after('<p class="price_sale">Всего со скидкой: <b>'+new_total_goods.toFixed(2) + " " + config.currency+'</b></p>');
                    break;
                }
            }
        }
    }

    /**
     * @name функция добавления товаров в корзину
     * @description если toggle задан, то переданное значение во втором парметре будет добавляться или удалять из массима
     * @param settingName
     * @param val
     * @param toggle
     */
    //localStorage.clear();
    function setCart(data){
        let goods = getCart();
        // если корзина пуста
        if(goods === null || Object.keys(goods).length == 0){
            goods = {};

            let countGoods = parseInt(data.count);

            if(countGoods < parseInt(data.countMax) || data.countMax == "-"){ // если ещё есть можно прибовлять шт.

                goods[data.id] = data;
                goods[data.id]["price"] = data.price;

                // если есть варианты цен
                if(data.variants){

                    data.variants.forEach(function(newPrice, i){

                        if(countGoods >= i){
                            goods[data.id]["price"] = newPrice;
                        }
                    })
                }

            } else{
                data.count = data.countMax;
                goods[data.id] = data;
            }

            //goods[data.id] = data;
        } else{

            // если товар уже есть такой, то приплюсовуем количество, если countMax позволяет
            if(goods[data.id]){

                let countGoods = parseInt(goods[data.id]["count"]);

                if(countGoods < parseInt(goods[data.id]["countMax"]) || goods[data.id]["countMax"] == "-"){ // если ещё есть можно прибовлять шт.

                    goods[data.id]["count"] = countGoods + parseInt(data.count);
                    goods[data.id]["price"] = data.price;

                    // если есть варианты цен
                    if(data.variants){

                        data.variants.forEach(function(newPrice, i){

                            if((countGoods + 1) >= i){
                                goods[data.id]["price"] = newPrice;
                            }
                        })
                    }

                } else{
                    alert("Больше не осталось этого товара!");
                    return false;
                }
            } else{
                goods[data.id] = data;
            }
        }

        localStorage.setItem("goods", JSON.stringify(goods));
        reinitGoods();
    }

    // добавление или отнимание количество товара
    function editCountGoods(id, action){

        let goods = getCart();
        //console.log(goods);
        // добавление
        if(action === true){

            if(parseInt(goods[id]["count"]) < parseInt(goods[id]["countMax"]) || goods[id]["countMax"] == "-"){ // если ещё есть можно прибовлять шт.

                goods[id]["count"] = parseInt(goods[id]["count"]) + 1;

                // если есть варианты цен
                if(goods[id]["variants"]){
                    goods[id]["variants"].forEach(function(newPrice, i){
                        if(goods[id]["count"] >= i && newPrice != null){
                            goods[id]["price"] = newPrice;
                        }
                    })
                }

                if(config.recalculation_price == "1") $("#price_" + id).text((goods[id]["count"] * goods[id]["price"]).toFixed(2));
            } else{
                //alert("Больше не осталось этого товара!");
                return false;
            }

            // отнимание
        } else if(action === false){

            if(parseInt(goods[id]["count"]) <= parseInt(goods[id]["countMax"]) || goods[id]["countMax"] == "-"){ // если ещё есть можно прибовлять шт.
                if(goods[id]["count"] != 0){
                    goods[id]["count"] = parseInt(goods[id]["count"]) - 1;

                    goods[id]["price"] = goods[id]["original_price"];
                    // если есть варианты цен
                    if(goods[id]["variants"]){
                        goods[id]["variants"].forEach(function(newPrice, i){
                            if(goods[id]["count"] >= i && newPrice != null){
                                goods[id]["price"] = newPrice;
                            }
                        })
                    }

                    if(config.recalculation_price == "1") $("#price_" + id).text((goods[id]["count"] * goods[id]["price"]).toFixed(2));
                }
            } else{
                //alert("Больше не осталось этого товара!");
                return false;
            }

            // конкретное число
        } else{

            if(action <= parseInt(goods[id]["countMax"]) || goods[id]["countMax"] == "-"){ // если ещё есть можно прибовлять шт.
                if(action != 0){
                    goods[id]["count"] = action;

                    // если есть варианты цен
                    if(goods[id]["variants"]){
                        goods[id]["variants"].forEach(function(newPrice, i){
                            if(goods[id]["count"] >= i && newPrice != null){
                                goods[id]["price"] = newPrice;
                            }
                        })
                    }

                    if(config.recalculation_price == "1") $("#price_" + id).text((action * goods[id]["price"]).toFixed(2));
                }
            } else{
                //alert("Больше не осталось этого товара!");
                return false;
            }
        }

        localStorage.setItem("goods", JSON.stringify(goods));


        let result_total = 0;
        // промо-код
        if($('[data-promo]').length > 0){

            result_total = parseFloat(totalGoods());

            let sale = $('[data-promo]').attr("data-promo");
            if(sale.indexOf('%') + 1){
                result_total = result_total - (result_total * parseInt(sale.split("%")[0])) / 100;
            } else result_total = result_total - parseFloat(sale.split(" ")[0])

            $('.total_with_sale').text(result_total + ' ' + config.currency);

        }

        // пересчет общей суммы с доставкой
        if($("#extra_method").length > 0){

            let tmp_method_total = '0';
            if(result_total == 0) result_total = parseFloat(totalGoods());

            let method_price = $("#extra_method option:checked").attr("data-price");
            let method_max_sum = $("#extra_method option:checked").attr("data-max_sum");

            // если сумма не пустая
            if(method_price != "" && method_price != undefined){

                // если это процент
                if(method_price.indexOf("%") + 1){

                    method_price = method_price.split("%")[0];
                    tmp_method_total = (result_total * method_price) / 100;

                } else tmp_method_total = method_price;

                // если цена в корзине превышена цене method_max_sum, то ставим доставку 0
                if(result_total >= parseFloat(method_max_sum)) tmp_method_total = 0;
            }

            result_total = (result_total + parseFloat(tmp_method_total)).toFixed(2) + ' ' + config.currency;

            $(".method_total b").text(parseFloat(tmp_method_total).toFixed(2) + ' ' + config.currency);
            $(".total_without_method b").text(result_total);
        }

        // кол-во - маркер
        if(countGoods() > 0){
            if($(".ks_dinamic_count").length > 0) $(".ks_dinamic_count").html(countGoods());
            else $("#cart_min").append('<span class="ks_dinamic_count">'+countGoods()+'</span>');
            $(".ks_count").text(countGoods());
        }

    }

    // запоминаем кол-во доп товаров
    function setAddonGoods(container){

        let goods_addon_count = [];
        $('#' + container + ' .addon_goods .ks_count_goods').each(function(){
            let id = $(this).parents('tr').attr('data-addon');
            if(goods_addon_count[id] == undefined) goods_addon_count[id] = [];
            goods_addon_count[id].push($(this).val());
        })
        localStorage.setItem('goods_addon_count', JSON.stringify(goods_addon_count));
    }

    // функция получения товаров из корзины
    function getCart(){
        let goods = localStorage.getItem("goods");
        if(goods !== null){
            let result;
            if(goods == undefined) result = JSON.parse(goods);
            else result = JSON.parse(goods);
            /*for (let key in result){
                result[key].addon = '';
            }*/
            return result;
        } else return null;
    }

    // функция удаления товаров из корзины
    function deleteGoods(id){
        let goods = localStorage.getItem("goods");
        let g = JSON.parse(goods);
        delete g[id];
        localStorage.setItem("goods", JSON.stringify(g));
    }

    // подсчет кол-во товаров в корзине
    function countGoods(){
        let goods = localStorage.getItem("goods");
        if(goods !== null){
            let g = JSON.parse(goods);
            let resultCount = 0;
            for (let key in g) {
                /* ... делать что-то с obj[key] ... */
                resultCount += parseInt(g[key]["count"]);
            }
            return resultCount;
        } return 0;
    }

    // общая сумма
    function totalGoods(){
        let goods = localStorage.getItem("goods");
        if(goods !== null){
            let g = JSON.parse(goods);
            let sum = 0;
            for (key in g) {
                sum += g[key].count * parseFloat(g[key].price);
            }

            /*if($(".total_with_sale").length > 0){

                sum = parseFloat($(".total_with_sale").text().split(" ")[0]);
                console.log(sum);
            }*/

            return sum.toFixed(2);
        } return 0;
    }

    // пересчет корзины
    function reinitGoods(){

        let goods = localStorage.getItem("goods");
        let g = JSON.parse(goods);
        let goods_addon_count = localStorage.getItem("goods_addon_count");

        let data = ('\n<tr>\n' +
            '<th>Наименование</th>\n' +
            '<th width="120">Кол-во</th>\n' +
            '<th width="120">Цена</th>\n' +
            '<th width="10"></th>\n' +
            '</tr>');

        for (let key in g) {

            let price = g[key].price;
            if(config.recalculation_price == "1") price = (g[key].count * parseFloat(g[key].price)).toFixed(2);

            let img = "";
            if(g[key].img != '' && g[key].img != undefined) img = '<img src="'+g[key].img+'" alt="">';

            let take = '';
            if(g[key].take == 1) take = '<span class="one_plus_one">+'+g[key].count+' шт. в подарок</span>\n';

            let addon_menu = '';
            let addon = '';
            let ii = 0;

            if(g[key].addon){

                addon_menu = '<span href="#" class="show_addon_goods"></span>';

                let find = 'class="addon_goods"';
                let re = new RegExp(find, 'g');
                addon = g[key].addon.replace(re, 'data-addon="'+g[key].id+'" class="addon_goods"');

                let re2 = new RegExp('value="[0-9]+"', 'g');

                let addonCount = g[key].count;
                //if(gc[ii]) addonCount = gc[ii];
                ii++;

                addon = addon.replace(re2, 'value="'+addonCount+'"');
            }

            let filterGoods = '';
            if(g[key].filterSite){
                let filterEx = JSON.parse(g[key].filterSite);
                console.log(filterEx);
                if(JSON.stringify(filterEx) != "{}"){
                    filterGoods = '<ul class="filterGoods">';
                    for (let key in filterEx) {
                        filterGoods += '<li><b>'+key+'</b>'+filterEx[key]+'</li>';
                    }
                    filterGoods += '</ul>';
                }
            }

            data += ('<tr data-id="'+g[key].id+'">\n' +
                '<td>\n' +
                '<a href="'+g[key].link+'" class="flex vc jcl goods_link">\n' +
                img+
                '<span class="goods_title">'+g[key].title+'</span>\n' +
                addon_menu +
                '</a>\n' +
                filterGoods+
                '</td>\n' +
                '<td>\n' +
                '<div class="flex vc">\n' +
                '<a href="#" class="ks_take_count">-</a>\n' +
                '<input type="text" class="ks_count_goods" data-countmax="'+g[key].countMax+'" value="'+g[key].count+'">\n' +
                '<a href="#" class="ks_add_count">+</a>\n' +
                take +
                '</div>\n' +
                '</td>\n' +
                '<td class="tc"><b id="price_'+g[key].id+'">'+price+'</b> '+config.currency+'</td>\n' +
                '<td><a href="#" class="ks_delete_goods" data-id="'+g[key].id+'" title="Удалить"></a></td>' +
                '</tr>\n' + addon);

            // делаем активными кнопки В корзину
            $("#goods_" + g[key].id).addClass("active_goods").html("В корзине <span>( " + g[key].count + " шт. )</span>");
        }
        $(".cart_table_min, .cart_table").html(data);

        // кол-во - маркер
        if(countGoods() > 0){
            if($(".ks_dinamic_count").length > 0) $(".ks_dinamic_count").html(countGoods());
            else $("#cart_min").append('<span class="ks_dinamic_count">'+countGoods()+'</span>');
            $(".ks_count").text(countGoods());
        }

        let getCart_ = getCart();
        for (let key in getCart_) {
            delete getCart_[key]['filterSite'];
            if(getCart_[key]['filter'] != undefined) getCart_[key]['filter'].replace("/", "\/");
        }
        $("#goods_ks").val(JSON.stringify(getCart_));

        let addon_for_form = [];
        if(goods_addon_count != null){
            let goods_addon_count_ = JSON.parse(goods_addon_count);
            for(let k in goods_addon_count_){
                if(goods_addon_count_[k] !== null){
                    let tmp = 0;
                    $('[data-addon="'+k+'"] .ks_count_goods').each(function(){
                        $(this).val(goods_addon_count_[k][tmp]);
                        if(addon_for_form['addon_'+k] == undefined) addon_for_form['addon_'+k] = [];
                        addon_for_form += k + ':' + goods_addon_count_[k][tmp]  + ';';
                        tmp++;
                    });
                }
            }
        }

        if($('[name="addon_goods"]').length > 0) $('[name="addon_goods"]').val(addon_for_form);
        else $('#ks_form').append('<input type="hidden" name="addon_goods" value=\''+addon_for_form+'\'>');


        let total_addon = 0;
        $('table [data-addon]').each(function(){
            let price_addon = parseFloat($(this).find('td:eq(2) b').text());
            let count_addon = parseInt($(this).find('.ks_count_goods').val());
            total_addon += price_addon * count_addon;
        })
        if(isNaN(total_addon)) total_addon = 0;

        let total_goods = parseFloat(totalGoods()) + total_addon;

        saleTest(config, total_goods);
        
        // всего
        $(".ks_total_cart b, .ks_total").text(total_goods.toFixed(2) + " " + config.currency);
        $(".total_wd").text((totalGoods() + parseFloat(config.price_delivery)) + " " + config.currency);
    }
    reinitGoods();

    // клик вне элемента
    $(document).on("click", function(event) {
        if ($(event.target).closest(".esc").length) return;
        $(".esc").stop(true, true).fadeOut(300);
        event.stopPropagation();
    });

    /* END --------------------------------
    * =====================================
    * =====================================
    * */


    $(document).on("click", ".show_addon_goods", function(){
        let g_id = $(this).parents('tr').data("id");
        $('[data-addon="'+g_id+'"]').slideToggle(300);
        return false;
    })






    /**
     * @name РЕДАКТИРУЕМОЕ ПОЛЬЗОВАТЕЛЕМ
     * =====================================
     * =====================================
     * */

    // открытие корзины
    $(document).on("click", "#cart_min", function(){
        $("#ks_goods, .bg_0").stop(true, true).fadeIn(300);
        return false;
    })
    // закрытие корзины
    $(document).on("click", ".close, .bg_0", function(){
        $("#ks_goods, .bg_0").stop(true, true).fadeOut(300);
        return false;
    })

    /* END --------------------------------
    * =====================================
    * =====================================
    * */





    /**
     * @name СИСТЕМА
     * =====================================
     * =====================================
     * */

    $(document).on("click", ".filter_short > li li", function(){

        $(".active_sh").removeClass("active_sh");
        $(this).addClass("active_sh");

        //let isImg = false;
        if($(this).find("img").length){
            let img = $(this).find("img").attr("src");
            $(".goods_img").find("img:first").attr("src", img);
            $(".goods_img").find("img:first").parent("a").attr("href", img);
            //isImg = true;
        }

        let original_price = parseFloat($(this).parents(".filter_short").attr('data-original-price'));
        let goods_id = $(this).attr('data-id').split('_')[0];

        if($(this).hasClass("active")){
            // $(this).removeClass("active");
            $(".ks_price").text(original_price);
        } else{
            if($(this).parent().find(".active").length){
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
            } else{
                $(this).addClass("active");
            }
        }

        // выбранные фильтры
        if($(this).parents(".filter_short").find(".active").length){

            let newPrice = original_price;
            $(this).parents(".filter_short").find(".active").each(function(){
                let filter_price = $(this).attr('data-price');
                if(filter_price != '' && filter_price != undefined)
                    newPrice += parseFloat(filter_price);
            })
            $("#price_"+goods_id).text(newPrice);
        }
    })

    // добавление товара в корзину и/или покупка
    $(document).on("click", ".go_to_cart, .add_to_cart", function(e){

        if(config.payment_guest == "0" && config.user_group == "5"){
            alert("Что бы совершить покупку, нужно зарегистрироваться или авторизоваться на сайте!");
            return false;
        }


        let goods = $(this).data("goods").split("|");
        let img = $(this).parents(".goods_img").find("img:first").attr("src");

        // счастливые часы
        let params = '';
        let take = 0;
        if($(this).data("params")){

            params = $(this).data("params");

            let t = new Date();
            //let time_now = Math.floor(t.getHours() / 1000);
            let hours = t.getHours();
            let minutes = t.getMinutes();
            for (let key in params) {

                let hm = params[key][0].split(":");
                let hm2 = params[key][1].split(":");

                if(((parseInt(hm[0]) * 60) + parseInt(hm[1]) * 1) < ((hours * 60)+(minutes * 1)) && (parseInt(hm2[0]) * 60) + parseInt(hm2[1]) * 1 > ((hours * 60)+(minutes * 1))){
                    take = 1;
                    break;
                }
            }
        }

        // дополнительные товары
        let addon = '';
        if($(this).data("addon")){

            let addon_source = $(this).data("addon");

            for (let key in addon_source.name) {

                addon += '<tr class="addon_goods">\n' +
                    '<td>\n' +
                    '<img src="'+addon_source.image[key]+'" alt="">\n' +
                    '<span class="goods_title">'+addon_source.name[key]+'</span>\n' +
                    '</td>\n' +
                    '<td>\n' +
                    '<div class="flex vc">\n' +
                    '<a href="#" class="ks_take_count">-</a>\n' +
                    '<input type="text" class="ks_count_goods" data-countmax="1000" value="1" disabled>\n' +
                    '<a href="#" class="ks_add_count">+</a>\n' +
                    '</div>\n' +
                    '</td>\n' +
                    '<td class="tc"><b id="price_161">'+addon_source.price[key]+'</b> '+config.currency+' / шт.</td>\n' +
                    '<td></td></tr>';
            }
        }

        let Goods = {};

        let g_id = goods[0];
        // нижняя строка позволяет добавлять такой же товар в корзину
        if($(".filter_short .active_sh").length){
            g_id = $(".filter_short .active_sh").attr("data-id");
        } else if($(".filter_short .active").length){
            g_id = $(".filter_short .active").attr("data-id");
        }

        let price = goods[2];
        let filter_data = "";
        Goods.filterSite = '';
        Goods.filter = '';
        let tmpFilterSite = {};
        let tmpFilter = {};
        let addSumFilter = 0;


        // выбранные фильтры
        if($(".filter_short .active").length){

            $(".filter_short").find(".active").each(function(){

                if($(this).attr('data-price') != '' && $(this).attr('data-price') != undefined)
                    addSumFilter += parseFloat($(this).attr('data-price'));

                // название фильтра
                let filter_name = $(this).parent().parent().find('p').text();

                if($(this).parent().parent().find(".active img").length){

                    $(this).parent().parent().find(".active img").each(function () {
                        let isImg = $(this).attr("src");
                        if(isImg != "" && isImg != undefined){
                            if(tmpFilter[filter_name] == undefined) tmpFilter[filter_name] = [];
                            if(tmpFilter[filter_name].includes(isImg) === false)
                                tmpFilter[filter_name].push(isImg);
                            if(tmpFilterSite[filter_name] == undefined) tmpFilterSite[filter_name] = [];
                            if(tmpFilterSite[filter_name].includes('<img src="'+isImg+'">') === false)
                                tmpFilterSite[filter_name].push('<img src="'+isImg+'">');
                        }
                    })

                } else{

                    let resultItems = '';
                    $(this).each(function () {
                        let isText = $(this).text();
                        let isColor = $(this).attr('data-color');
                        if(isColor != "" && isColor != undefined){
                            tmpFilter["color"] = isColor;
                            resultItems += '<span class=\'colorSelected\' style=\'background:'+isColor+'\'></span>';
                        }
                        if(isText != "" && isText != undefined){
                            resultItems += isText;
                        }
                    })
                    if(tmpFilter[filter_name] == undefined) tmpFilter[filter_name] = [];
                    if(tmpFilter[filter_name].includes(resultItems) === false)
                        tmpFilter[filter_name].push(resultItems);
                    if(tmpFilterSite[filter_name] == undefined) tmpFilterSite[filter_name] = [];
                    if(tmpFilterSite[filter_name].includes(resultItems) === false)
                        tmpFilterSite[filter_name].push(resultItems);
                }
            })

        }
        if(!isNaN(addSumFilter))
            addSumFilter = parseFloat(addSumFilter.toFixed(2));
        else
            addSumFilter = 0;

        //console.log(addSumFilter);
        delete tmpFilter["Цвет"];

        Goods.filterSite = JSON.stringify(tmpFilterSite);
        Goods.filter = JSON.stringify(tmpFilter);

        /*console.log(tmpFilter);
        console.log(Goods);
        return false;*/

        let countCounter = 1;
        if($('[data-ksid="'+goods[0]+'"]').length > 0) countCounter = $('[data-ksid="'+goods[0]+'"]').val();
        // варианты цен
        let variants = [];
        let original_price = price;

        // если это своя кнопка или произвольная сумма
        if(goods[5] == 'unique'){

            g_id = new Date().getTime();
            if($(this).prev().hasClass('my_price')){
                price = $(this).prev().find('input').val();
                if(price == '') price = 100;

                original_price = price;
            }
            img = '';

        } else{

            if(goods[5] != undefined && goods[5] != ''){
                let variantsTmp = goods[5].split('-');
                let variantsPrice = variantsTmp[0].split(',');
                let variantsCounter = variantsTmp[1].split(',');
                variantsPrice.forEach(function(item, i) {
                    variants[variantsCounter[i]] = item;
                });
            }
        }

        price = parseFloat(parseFloat(price).toFixed(2))+addSumFilter;
        if(priceInt) price = parseFloat(price).toFixed(2);

        Goods.id = g_id;
        Goods.title = goods[1] + filter_data;
        Goods.original_price = original_price;
        Goods.price = price;
        Goods.count = countCounter; // по умолчанию 1 шт.
        Goods.take = take; // счастливые часы
        Goods.addon = addon; // дополнительные товары
        Goods.countMax = goods[3]; // максимальное кол-во шт.
        Goods.link = goods[4]; // ссылка на товар
        Goods.variants = variants; // варианты цен
        Goods.img = img;

        setCart(Goods);

        // если нажата кнопка (в корзину)
        if(e.target.className != "go_to_cart"){

            // полет в корзину
            let top_el = $(this).offset().top;
            let left_el = $(this).offset().left;
            let cart_top_el = $("#cart_min").offset().top;
            let cart_left_el = $("#cart_min").offset().left;
            $("body").append('<div class="cart_plain"></div>');
            $(".cart_plain").css({'background': '#5bb31b', 'position' : 'absolute', 'zIndex' : '9999', 'width' : '50px', 'height' : '50px', 'borderRadius' : '100px', 'left' : left_el + 'px', 'top': top_el + 'px'})
                .animate({'top': cart_top_el + 'px', 'left': cart_left_el + 'px',  'width': '10px',  'height': '10px', 'zIndex' : '9999'}, 700, function() {
                    $(this).remove();
                });

            return false;
        }

    })



    // удаление товара из корзины
    $(document).on("click", ".ks_delete_goods", function(){
        let id = $(this).data("id");
        deleteGoods(id);
        reinitGoods();
        $("#goods_"+id).removeClass("active_goods").text("В корзину");
        if(countGoods() == 0) $(".ks_dinamic_count").remove();
        let getCart_ = getCart();
        for (let key in getCart_) {
            delete getCart_[key]['filterSite'];
            getCart_[key]['filter'].replace("/", "\/");
        }
        $("#goods_ks").val(JSON.stringify(getCart_));
        return false;
    })

    // добавление кол-во
    $(document).on("click", ".ks_add_count", function(){

        let this_container = $(this).parents("table").parent().attr('id');
        // клик по доп товарам
        let is_addon_goods = $(this).parents("tr").hasClass('addon_goods');

        let id = $(this).parents("[data-id]").data("id");
        let count = $(this).prev().val();
        let countMax = $(this).prev().data("countmax");

        if(count < countMax || countMax == '-'){
            let count_result = parseInt(count) + 1;
            $(this).prev().val(count_result);
            if($('[data-addon="'+id+'"]').length > 0){

                $('[data-addon="'+id+'"]').each(function(){
                    let count_addon = $(this).find('.ks_count_goods').val();
                    if(count_addon < count_result) $(this).find('.ks_count_goods').val(count_result);
                })
            }
            if(!is_addon_goods) editCountGoods(id, true);
            setAddonGoods(this_container);

            let total_addon = 0;
            $('table [data-addon]').each(function(){
                let price_addon = parseFloat($(this).find('td:eq(2) b').text());
                let count_addon = parseInt($(this).find('.ks_count_goods').val());
                total_addon += price_addon * count_addon;
            })
            if(isNaN(total_addon)) total_addon = 0;

            let total_goods = parseFloat(totalGoods()) + total_addon;

            saleTest(config, total_goods);

            // всего
            $(".ks_total_cart b, .ks_total").text(total_goods.toFixed(2) + " " + config.currency);
            //$(".ks_total_cart b, .ks_total").text(totalGoods() + " " + config.currency);
            $(".total_wd").text((parseFloat(totalGoods()) + parseFloat(config.price_delivery)) + " " + config.currency);
        }
        let getCart_ = getCart();
        for (let key in getCart_) {
            delete getCart_[key]['filterSite'];
            getCart_[key]['filter'].replace("/", "\/");
        }
        $("#goods_ks").val(JSON.stringify(getCart_));
        if($(this).parent().find('.one_plus_one').length > 0)
            $(this).parent().find('.one_plus_one').text('+'+(parseInt(count) + 1)+' шт. в подарок');

        let goods_addon_count = localStorage.getItem("goods_addon_count");
        let addon_for_form = [];
        if(goods_addon_count != null){
            let goods_addon_count_ = JSON.parse(goods_addon_count);
            for(let k in goods_addon_count_){
                if(goods_addon_count_[k] !== null){
                    let tmp = 0;
                    $('[data-addon="'+k+'"] .ks_count_goods').each(function(){
                        $(this).val(goods_addon_count_[k][tmp]);
                        if(addon_for_form['addon_'+k] == undefined) addon_for_form['addon_'+k] = [];
                        addon_for_form += k + ':' + goods_addon_count_[k][tmp]  + ';';
                        tmp++;
                    });
                }
            }
        }

        if($('[name="addon_goods"]').length > 0) $('[name="addon_goods"]').val(addon_for_form);
        else $('#ks_form').append('<input type="hidden" name="addon_goods" value=\''+addon_for_form+'\'>');

        return false;
    })

    // отнимание кол-во
    $(document).on("click", ".ks_take_count", function(){

        let this_container = $(this).parents("table").parent().attr('id');
        // клик по доп товарам
        let is_addon_goods = $(this).parents("tr").hasClass('addon_goods');
        let count_min = 0;

        if(is_addon_goods){
            let addon_id = $(this).parents("tr").attr('data-addon');
            count_min = $('[data-id="'+addon_id +'"]').find('.ks_count_goods').val();
        }

        let id = $(this).parents("[data-id]").data("id");
        let count = $(this).next().val();
        let countMax = $(this).next().data("countmax");
        if((count <= countMax || countMax == '-') && count > 1){
            let count_result = parseInt(count) - 1;
            if(is_addon_goods && count_result >= count_min) $(this).next().val(count_result);
            else if(!is_addon_goods) $(this).next().val(count_result);
            if(!is_addon_goods) editCountGoods(id, false);
            setAddonGoods(this_container);

            let total_addon = 0;
            $('table [data-addon]').each(function(){
                let price_addon = parseFloat($(this).find('td:eq(2) b').text());
                let count_addon = parseInt($(this).find('.ks_count_goods').val());
                total_addon += price_addon * count_addon;
            })
            if(isNaN(total_addon)) total_addon = 0;

            let total_goods = parseFloat(totalGoods()) + total_addon;

            saleTest(config, total_goods);

            // всего
            $(".ks_total_cart b, .ks_total").text(total_goods.toFixed(2) + " " + config.currency);
            //$(".ks_total_cart b, .ks_total").text(totalGoods() + " " + config.currency);
            $(".total_wd").text((parseFloat(totalGoods()) + parseFloat(config.price_delivery)) + " " + config.currency);
        }
        let getCart_ = getCart();
        for (let key in getCart_) {
            delete getCart_[key]['filterSite'];
            getCart_[key]['filter'].replace("/", "\/");
        }
        $("#goods_ks").val(JSON.stringify(getCart_));
        if($(this).parent().find('.one_plus_one').length > 0 && (parseInt(count) - 1) != 0)
            $(this).parent().find('.one_plus_one').text('+'+(parseInt(count) - 1)+' шт. в подарок');

        let goods_addon_count = localStorage.getItem("goods_addon_count");
        let addon_for_form = [];
        if(goods_addon_count != null){
            let goods_addon_count_ = JSON.parse(goods_addon_count);
            for(let k in goods_addon_count_){
                if(goods_addon_count_[k] !== null){
                    let tmp = 0;
                    $('[data-addon="'+k+'"] .ks_count_goods').each(function(){
                        $(this).val(goods_addon_count_[k][tmp]);
                        if(addon_for_form['addon_'+k] == undefined) addon_for_form['addon_'+k] = [];
                        addon_for_form += k + ':' + goods_addon_count_[k][tmp]  + ';';
                        tmp++;
                    });
                }
            }
        }

        if($('[name="addon_goods"]').length > 0) $('[name="addon_goods"]').val(addon_for_form);
        else $('#ks_form').append('<input type="hidden" name="addon_goods" value=\''+addon_for_form+'\'>');

        return false;
    })

    // ручной ввод кол-во
    $(document).on("keyup", ".ks_count_goods", function(){
        let this_container = $(this).parents("table").parent().attr('id');
        let id = $(this).parents("[data-id]").data("id");
        let count = $(this).val();
        let countMax = $(this).data("countmax");
        if(count != "" && count != 0 && count <= countMax || countMax == '-' && count != "") editCountGoods(id, count);
        else{
            if(count == ""){
                editCountGoods(id, 1);
            } else{
                $(this).val(countMax);
                editCountGoods(id, countMax);
            }
        }
        setAddonGoods(this_container);

        let total_addon = 0;
        $('table [data-addon]').each(function(){
            let price_addon = parseFloat($(this).find('td:eq(2) b').text());
            let count_addon = parseInt($(this).find('.ks_count_goods').val());
            total_addon += price_addon * count_addon;
        })
        if(isNaN(total_addon)) total_addon = 0;

        let total_goods = parseFloat(totalGoods()) + total_addon;

        saleTest(config, total_goods);

        // всего
        $(".ks_total_cart b, .ks_total").text(total_goods.toFixed(2) + " " + config.currency);
        $(".total_wd").text((parseFloat(totalGoods()) + parseFloat(config.price_delivery)) + " " + config.currency);
        let getCart_ = getCart();
        for (let key in getCart_) {
            delete getCart_[key]['filterSite'];
            getCart_[key]['filter'].replace("/", "\/");
        }
        $("#goods_ks").val(JSON.stringify(getCart_));

        let goods_addon_count = localStorage.getItem("goods_addon_count");
        let addon_for_form = [];
        if(goods_addon_count != null){
            let goods_addon_count_ = JSON.parse(goods_addon_count);
            for(let k in goods_addon_count_){
                if(goods_addon_count_[k] !== null){
                    let tmp = 0;
                    $('[data-addon="'+k+'"] .ks_count_goods').each(function(){
                        $(this).val(goods_addon_count_[k][tmp]);
                        if(addon_for_form['addon_'+k] == undefined) addon_for_form['addon_'+k] = [];
                        addon_for_form += k + ':' + goods_addon_count_[k][tmp]  + ';';
                        tmp++;
                    });
                }
            }
        }

        if($('[name="addon_goods"]').length > 0) $('[name="addon_goods"]').val(addon_for_form);
        else $('#ks_form').append('<input type="hidden" name="addon_goods" value=\''+addon_for_form+'\'>');

        return false;
    })

    // очистка корзины
    $(document).on("click", ".clear_cart", function(){
        $(".ks_dinamic_count").remove();
        localStorage.clear();
        reinitGoods();
        $(".add_to_cart").removeClass("active_goods").text("В корзину");
        $("#goods_ks").val("");
        return false;
    })

    // отправка данных с формы
    $(document).on("click", "#ks_payment", function(){

        if(countGoods() == 0){
            alert("В корзине путо!");
            return false;
        }

        /*if($("#extra_method option:selected").val() == "0"){
            alert("Выберете способ доставки!");
            return false;
        }*/

        // если включена доставка
        if(config.delivery_power && $(".is_delivery_select").length > 0){

            let is_delivery_select = $(".is_delivery_select option:checked").val();

            if($("#ks_map").length > 0 && is_delivery_select.indexOf("вывоз") + 1 && $(".selected_delivery").length == 0){

                alert("Выберете пункт самовывоза на карте");
                return false;

            } else if($(".delivery_city").length > 0){

                let delivery_city = $(".delivery_city option:checked").val();

                if(!delivery_city){
                    alert("Выберете город");
                    return false;
                }
            }
        }
    })

    // раскрываем блок добавления товара
    $("#ks_power").change(function(){
        if($(this).prop("checked") === true) $(".is_goods").stop(true, true).slideDown(300);
        else $(".is_goods").stop(true, true).slideUp(300);
    })

    // вставляем название товара из заголовка
    $(document).on("click", "#source_title", function(){
        let news_title = $('[name="title"]').val();
        $("#ks_title").val(news_title);
        return false;
    })

    // открытие фильтра
    $("#ks_filter_power").change(function(){
        if($(this).prop("checked") === true) $("#filter").stop(true, true).slideDown(300);
        else $("#filter").stop(true, true).slideUp(300);
    })

    // если есть фильтр
    if($("#ks_filter").length > 0){

        let valMinPrice = config.minPrice;
        let valMaxPrice = config.maxPrice;

        let filter_params = localStorage.getItem("filter");
        if(filter_params !== null){ // если в памяти есть фильтр
            filter_params = filter_params.split(";");
            $.each(filter_params, function(i, data){
                if(data != ""){
                    let data_price = data.split(":");
                    if(data_price[0] == "price"){ // цена
                        let tmp_price = data_price[1].split("-");
                        valMinPrice = tmp_price[0];
                        valMaxPrice = tmp_price[1];
                    }
                    $('[data-filter="'+data+'"]').prop("checked", true);
                }
            })
        }

        /**
         * FILTER RELOAD
         */
        function initFilter(clear = null){

            $(".bg_00, .la-fire, .load-bar").remove(); // удаляем предыдущий loader
            $("#ks_filter").append('<div class="bg_00"></div><div class="la-fire"><div></div><div></div><div></div></div>');
            $("#dle-content").append('<div class="bg_00"><div class="load-bar"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>');
            $(".bg_00, .la-fire, .load-bar").stop(true, true).fadeIn(500);

            let filter_item = "";
            $(".filter_check").each(function(){
                if($(this).prop("checked") === true){
                    filter_item += $(this).data("filter") + ";";
                }
            })
            let filter_price = $('#ks_filter_price').slider("option", "values");
            let result_params = "price:" + filter_price[0] + "-" + filter_price[1] + ";" + filter_item;

            if($('.ks_filter_slider').length > 0){

                $(".ks_filter_slider").each(function(){

                    let slider_name = $(this).attr("data-name");
                    let filter_slider = $(this).slider("option", "values");
                    result_params += slider_name+":" + filter_slider[0] + "-" + filter_slider[1] + ";";

                })
            }

            // заносим в память
            localStorage.setItem("filter", result_params);
            let uri = url.split("?");
            // меняем URL encodeURIComponent
            if(clear) history.pushState(null, null, uri[0]);
            else history.pushState(null, null, uri[0] + '?filter='+result_params);

            setTimeout(function(){ // делаем паузу, что бы снизить нагрузку на сервер
                $.ajax({ type: 'POST', url: url,
                    data: {
                        "get_goods": result_params
                    }, dataType: 'text',
                    success: function(data){
                        $(".bg_00").stop(true, true).fadeOut(200);
                        $(".la-fire, .load-bar").stop(true, true).fadeOut(700);
                        $("#dle-content").html(data);
                        paginationReload('/?filter='+result_params); // прибавляем к пунктам пагинации фильтр
                    },error: function(data){console.log(data);}
                });
            }, 500);
        }

        $(document).on("change", ".filter_check", function(){
            initFilter();
        })

        $(".ks_filter_from b").text(valMinPrice + ' ' + config.currency);
        $(".ks_filter_to b").text(valMaxPrice + ' ' + config.currency);

        $( "#ks_filter_price" ).slider({
            range: true,
            step: 10,
            min: parseInt(config.minPrice),
            max: parseInt(config.maxPrice),
            values: [ parseInt(valMinPrice), parseInt(valMaxPrice) ],
            slide: function( event, ui ) {
                $(".ks_filter_from b").text(ui.values[0] + ' ' + config.currency);
                $(".ks_filter_to b").text(ui.values[1] + ' ' + config.currency);
            },
            stop: function(){
                initFilter();
            }
        });

        // если есть слайдеры
        if($('.ks_filter_slider').length > 0){

            $(".ks_filter_slider").each(function(){

                let slider_step = $(this).attr("data-step");
                let this_ks_slider_from = $(this).prev().find(".ks_slider_from b");
                let this_ks_slider_to = $(this).prev().find(".ks_slider_to b");
                let ks_slider_from = $(this).prev().find(".ks_slider_from b").text();
                let ks_slider_to = $(this).prev().find(".ks_slider_to b").text();

                $(this).slider({
                    range: true,
                    step: parseInt(slider_step),
                    min: parseInt(ks_slider_from),
                    max: parseInt(ks_slider_to),
                    values: [ parseInt(ks_slider_from), parseInt(ks_slider_to) ],
                    slide: function( event, ui ) {
                        this_ks_slider_from.text(ui.values[0]);
                        this_ks_slider_to.text(ui.values[1]);
                    },
                    stop: function(){
                        initFilter();
                    }
                });
            })
        }

        // очистка фильтра
        $(document).on("click", "#clear_filter", function(){
            localStorage.setItem("filter", "");
            $(".filter_check").each(function(){
                $(this).prop("checked", false);
            })
            $(".ks_filter_from b").text(config.minPrice + ' ' + config.currency);
            $(".ks_filter_to b").text(config.maxPrice + ' ' + config.currency);
            $('#ks_filter_price').slider({values: [ parseInt(config.minPrice), parseInt(config.maxPrice) ]});
            if($('.ks_filter_slider').length > 0){
                $(".ks_filter_slider").each(function(){
                    let ks_slider_from = $(this).attr("data-min");
                    let ks_slider_to = $(this).attr("data-max");
                    $(this).prev().find(".ks_slider_from b").text(ks_slider_from);
                    $(this).prev().find(".ks_slider_to b").text(ks_slider_to);
                    $(this).slider({values: [ parseInt(ks_slider_from), parseInt(ks_slider_to) ]});
                })
            }
            initFilter(1);
            return false;
        })
    }

    // выбор фильтра и цены соответственно
    /*$(document).on("click", ".filter_select", function(){
        let price = $(".filter_select option:selected").attr("data-price");
    })*/

    // прибавляем к пунктам пагинации фильтр
    function paginationReload(filter_params){
        $(".navigation a").each(function(){
            let filter_link = filter_params.split("?filter=")[1];
            let navigation_link = $(this).attr("href");
            $(this).attr("href", navigation_link + "?filter=" + filter_link);
            navigation_link = "";
        })
    }
    if(url.indexOf("?filter=") + 1){
        paginationReload(url);
    }





    /**
     * @name DELIVERY (MAP)
     */
    if($("#ks_map").length > 0){

        let locationSet = {lat: 0, lng: 0};
        let mapZoom = 5;

        // свойства карты такое же как в админке
        let delivery_mapInfo = $("#ks_map").attr("data-config");
        if(delivery_mapInfo){
            delivery_mapInfo = JSON.parse(delivery_mapInfo);
            locationSet = {lat: delivery_mapInfo.lat, lng: delivery_mapInfo.lng};
            mapZoom = delivery_mapInfo.zoom;
        }

        // создаем карту
        map = new google.maps.Map(document.getElementById("ks_map"), {
            zoom: mapZoom,
            center: locationSet,
        });

        let infowindow;


        // получаем маркеры
        let delivery_markers = $("#ks_map").attr("data-markers");

        if(delivery_markers){ // если есть маркеры


            // выбор способа доставки
            $(document).on("change", ".is_delivery_select", function(){

                let delivery_selected = $(this).children("option:selected").text();

                // самовывоз
                if(delivery_selected == "Самовывоз" || delivery_selected == "Самовывоз\n"){

                    $("#cart_full .map_cart").stop().slideDown(300);
                    $(".delivery_city, .total_width_delivery").remove();

                    // доставка
                } else{

                    $(".is_location_selected, .selected_delivery").remove();
                    $("#cart_full .map_cart").stop().slideUp(300);

                    let city_ = $('[data-city]').attr("data-city").split("|");

                    city_options = '<option value="" selected disabled>-- Выберете --</option>'+"/n";
                    city_.forEach(function(item, i, arr) {
                        city_options += '<option value="'+item+'">'+item+'</option>'+"/n";
                    });

                    $(this).after('<select name="delivery_city" class="delivery_city" required>'+city_options+'</select>');
                }
            })


            // выбор города доставки
            $(document).on("change", ".delivery_city", function(){

                if(totalGoods() > config.max_total_delivery){
                    $("#ks_payment").before('<div class="total_width_delivery">Стоимость доставки: <b>'+config.price_delivery+' '+config.currency+'</b><br>' +
                        '<p><br>Всего к оплате: <b class="total_wd">'+(parseFloat(totalGoods()) + parseFloat(config.price_delivery))+' '+config.currency+'</b></p></div>');
                }

            })


            delivery_markers = JSON.parse(delivery_markers);

            for (key in delivery_markers) {

                let coords = delivery_markers[key].coords.split(",");

                let marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(coords[0]),
                        lng: parseFloat(coords[1])
                    },
                    map: map,
                    icon: '/engine/skins/kylshop/img/marker.png?v=0.1',
                    title: '' + delivery_markers[key].title + ''
                });

                infowindow = new google.maps.InfoWindow({
                    content: '<h3>' + delivery_markers[key].title + '</h3><br>' + delivery_markers[key].description + '<br><a href="#" class="select_delivery" data-title="'+delivery_markers[key].title+'">Выбрать</a>',
                    maxWidth: 300
                });
                marker.infowindow = infowindow;

                marker.addListener('click', function() {
                    return this.infowindow.open(map, this);
                });

                marker.set("id", delivery_markers[key].marker_id);
            }


            // выбор места на карте
            $(document).on("click", ".select_delivery", function(){
                let select_delivery = $(this).attr("data-title");
                $(".checked_location").remove();
                $(this).after('<p class="checked_location">Выбрано</p>');
                $(".title_over_map").slideUp(300);

                $(".is_location_selected").remove();
                $(".is_delivery_select").after('<p class="is_location_selected">Самовывоз из: '+select_delivery+'</p>');

                if($(".selected_delivery").length > 0) $(".selected_delivery").val(select_delivery);
                else $("#ks_payment").before('<input type="hidden" name="payment_delivery" class="selected_delivery" value="'+select_delivery+'">');
                return false;
            })

        }

    }

    $(document).on("change", ".is_delivery_select", function(){

        let delivery_selected = $(this).find('option:selected').val();

        $('.with_pickup_sale, [name="pickup"]').remove();

        if(delivery_selected == "Самовывоз" || delivery_selected == "Самовывоз\n" && config.pickup_sale != ''){

            let pickup_sale = parseInt(config.pickup_sale.replace("%", ""));

            let result_price = (totalGoods() - ((totalGoods() * pickup_sale) / 100)).toFixed(2);
            $(this).after('<span class="with_pickup_sale">Итого со скидкой '+config.pickup_sale+': <b>'+result_price+' '+config.currency+'</b></span>');
            $("#ks_form").append('<input type="hidden" name="pickup" value="1">');

        }

    })



    /**
     * @name выбор способа доставки
     */
    $(document).on("change", "#extra_method", function(){

        let tmp_method_total = '0';
        let result_total = parseFloat(totalGoods());

        // если введен промо-код
        if($(".total_with_sale").length > 0){
            result_total = parseFloat($(".total_with_sale").text().split(" ")[0]);
        }

        let method = $(this).find("option:checked").val();
        let method_price = $(this).find("option:checked").attr("data-price");
        let method_max_sum = $(this).find("option:checked").attr("data-max_sum");

        $(".method_total").show();

        // если сумма не пустая
        if(method_price != ""){

            // если это процент
            if(method_price.indexOf("%") + 1){

                method_price = method_price.split("%")[0];
                tmp_method_total = (result_total * method_price) / 100;

            } else tmp_method_total = method_price;

            // если цена в корзине превышена цене method_max_sum, то ставим доставку 0
            if(result_total >= parseFloat(method_max_sum)) tmp_method_total = 0;
        }

        result_total = (parseFloat(result_total) + parseFloat(tmp_method_total)).toFixed(2) + ' ' + config.currency;

        $(".method_total b").text(parseFloat(tmp_method_total).toFixed(2) + ' ' + config.currency);
        $(".total_without_method b").text(result_total);
        $(".total_without_method").show();
        $('[name="extra_method"]').val(method);

        // добавляем поле в форму
        if($("#method_value").length > 0) $("#method_value").val(method);
        else $("#ks_form").append('<input type="hidden" name="method" value="'+method+'" id="method_value">');

    })


    // применение промо-кода
    $(document).on("click", "#apply_promo_code", function(){

        let promo_code = $("#promo_code").val();
        if(promo_code != ""){

            let goods = localStorage.getItem("goods");

            $.ajax({
                type: 'POST', url: window.location.href,
                data: {
                    "promo_code": promo_code,
                    "goods": goods
                },
                dataType: 'text',
                success: function(data){

                    console.log(data);

                    if(data == 'no'){
                        $(".without_sale").html('<span class="sale_empty">Промо-код не действителен!</span>');
                        return false;
                    }

                    let dataString = data.split(":");

                    let sale = dataString[1];
                    let price_without_sale = dataString[0];

                    /*let sale = data;
                    let price_without_sale = totalGoods();

                    if(data.indexOf('%') + 1){

                        let percent = data.split('%')[0];

                        price_without_sale = price_without_sale - (price_without_sale * percent) / 100;

                    } else{

                        sale = data + ' ' + config.currency;
                        price_without_sale = (price_without_sale - parseFloat(data));
                    }*/

                    $("#promo_code").attr("data-promo", sale);

                    $(".without_sale").html('Итого со скидкой <span>('+sale+')</span>: <b class="total_with_sale">' + price_without_sale + ' ' + config.currency + '</b>');

                    // добавляем поле в форму
                    if($("#promo_value").length > 0) $("#promo_value").val(promo_code);
                    else $("#ks_form").append('<input type="hidden" name="promo-code" value="'+promo_code+'" id="promo_value">');



                    // пересчет общей суммы с доставкой
                    if($("#extra_method").length > 0){

                        let tmp_method_total = '0';

                        let method_price = $("#extra_method option:checked").attr("data-price");
                        let method_max_sum = $("#extra_method option:checked").attr("data-max_sum");

                        // если сумма не пустая
                        if(method_price != "" && method_price != undefined){

                            // если это процент
                            if(method_price.indexOf("%") + 1){

                                method_price = method_price.split("%")[0];
                                tmp_method_total = (price_without_sale * method_price) / 100;

                            } else tmp_method_total = method_price;

                            // если цена в корзине превышена цене method_max_sum, то ставим доставку 0
                            if(price_without_sale >= parseFloat(method_max_sum)) tmp_method_total = 0;
                        }

                        price_without_sale = (price_without_sale + parseFloat(tmp_method_total)).toFixed(2) + ' ' + config.currency;

                        $(".method_total b").text(parseFloat(tmp_method_total).toFixed(2) + ' ' + config.currency);
                        $(".total_without_method b").text(price_without_sale);
                    }


                }
            });
        }
        return false;
    })




    /* END --------------------------------
    * =====================================
    * =====================================
    * */

})