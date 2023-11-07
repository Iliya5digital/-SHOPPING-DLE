<?php
/**
 * @name краткая новость
 */
if( !defined('DATALIFEENGINE') ) {
    header( "HTTP/1.1 403 Forbidden" );
    header ( 'Location: ../../' );
    die( "Hacking attempt!" );
}

header("Content-Type: text/html; charset=utf-8");

include (DLEPlugins::Check(ENGINE_DIR . '/modules/kylshop/config.php'));

$price = $price_sale = $sale = $sale_type = $filter = $related_goods = "";
$count = 1;
$count_orders = 0;
$counter_cart = '';

// если новость является платной
if(!empty($row["kylshop"]) && $member_id["user_group"] != "5" || $member_id["user_group"] == "5"){

    # TODO нужно как-то продумать этот запрос поставить раньше, что бы он обрабатывался один раз
    # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $goods = $db->super_query( "SELECT status FROM " . PREFIX . "_kylshop_buy WHERE user_id = '{$member_id["user_id"]}' AND goods LIKE '%\"id\":\"{$row["id"]}\"%' AND (status = '1' OR status = '2')" );

    if(!empty($row["kylshop"])){

        $count_orders_ = $db->super_query( "SELECT COUNT(id) AS count FROM " . PREFIX . "_kylshop_buy WHERE goods LIKE '%\"id\":\"{$row["id"]}\"%' AND status = '1'" );
        $count_orders = $count_orders_["count"];

        $kylshop = unserialize($row["kylshop"]);

        // если пользователь не гость и есть другие цены для этой группы
        if($member_id["user_group"] != '5' && !empty($kylshop["ks_group"]) && array_search($member_id['user_group'], $kylshop["ks_group"]) !== false){

            $kylshop["ks_price"] = $kylshop["ks_group_price"][array_search($member_id['user_group'], $kylshop["ks_group"])];
        }

        // 1+1
        $data_params = '';
        if(!empty($kylshop["one_plus_one"])){

            $data_params = ' data-params=\''.json_encode($kylshop["one_plus_one"], JSON_UNESCAPED_UNICODE).'\'';

            $allowed_one_plus_one = false;
            foreach ( $kylshop["one_plus_one"] as $item ) {

                if($item[0] < date("H:i", time()) && $item[1] > date("H:i", time())){
                    $allowed_one_plus_one = true;
                }
            }

            if($allowed_one_plus_one === true){
                $tpl->set('[present]', "");
                $tpl->set('[/present]', "");
            } else $tpl->set_block( "'\\[present\\](.*?)\\[/present\\]'si", "" );

        } else{

            $tpl->set_block( "'\\[present\\](.*?)\\[/present\\]'si", "" );
        }

        // Дополнительные товары
        $data_addon = '';
        if(!empty($kylshop["addon"])){
            $data_addon = ' data-addon=\''.json_encode($kylshop["addon"], JSON_UNESCAPED_UNICODE).'\'';
        }


        if(!empty($kylshop["related_id"])) $related_goods = $kylshop["related_id"];
        if(!empty($kylshop["ks_price"])) $price = $price_sale = $kylshop["ks_price"];

        $count = 1;

        // если есть скидка
        if(!empty($kylshop["ks_sale"])){

            $sale_type = $kylshop["ks_sale_type"];

            if($kylshop["ks_sale_type"] == "%") $price_sale = (float)$price - ((float)$price * (int)$kylshop["ks_sale"]) / 100;
            else $price_sale = (float)$price - (int)$kylshop["ks_sale"];

            $sale = (int)$kylshop["ks_sale"];
        }

        $kylshop["ks_title"] = str_replace(['"', "'", "|"], "", $kylshop["ks_title"]);
        $price_sale = str_replace(['"', "'", "|"], "", $price_sale);

        // если задано кол-во
        if(!empty($kylshop["ks_count_goods"]) && !empty($kylshop["ks_count"]))
            $count = (int)$kylshop["ks_count"];
        else $count = '-';

        $counter_cart = '<div class="ks_counter">
            <input type="number" name="ks_counter" data-ksid="'.$row["id"].'" min="1" value="1">
        </div>';

        // если этот товар куплен и присутствует текст после оплаты
        if($goods != null && $goods['status'] != 0 && !empty($kylshop["after_payment"])){

            if($goods["status"] == "2"){
                $product = '<span class="on_moder">На модерации</span>';
            }
            else{
                $product = $kylshop["after_payment"];
            }

            // если товар не куплен
        } else{

            $product = '';
        }

        $link_go_payment = '<a href="/?do=cart" class="go_to_cart" data-goods="'.$row["id"].'|'.$kylshop["ks_title"].'|'.$price_sale.'|'.$count.'|'.$full_link.'"'.$data_params.$data_addon.'>Купить</a>';

        // если включена кнопка добавления товара в корзину
        if($ks_config["add_to_cart"] == true) $link_add_to_cart = '<a href="#" class="add_to_cart" id="goods_'.$row["id"].'" data-goods="'.$row["id"].'|'.$kylshop["ks_title"].'|'.$price_sale.'|'.$count.'|'.$full_link.'"'.$data_params.$data_addon.'>'.$ks_config["btn_title_add_to_cart"].'</a>';

        //}

        // если задан фильтр
        if(!empty($row["filter"])){

            $filter_source = explode("||", $row["filter"]);

            $filter_file = json_decode(file_get_contents(ENGINE_DIR . '/modules/kylshop/filter.json'), true);
            $filter_prices = json_decode($filter_source[1], true);

            $tmp_filter = [];
            foreach ($filter_file["value"] as $key_title => $item) {
                $j = 0;
                foreach ($item as $it) {

                    if(!empty($filter_prices[$key_title."_".$j])){
                        $tmp_filter[$it] = ["title" => $it, "price" => $filter_prices[$key_title."_".$j]];
                    } else{
                        $tmp_filter[$it] = ["title" => $it, "price" => $price];
                    }
                    $j++;
                }
            }

            $filter_array = [];
            $filter = '<ul class="filter_short" data-original-price="'.$price.'">';
            $filter_ = explode(",", $filter_source[0]);
            foreach ($filter_ as $filter_item) {
                if(!empty($filter_item)){
                    $filter_exp = explode(":", $filter_item);
                    $filter_array[$filter_exp[0]][] = $filter_exp[1];
                }
            }
            $i = 0;
            if(!empty($filter_array)){
                foreach ($filter_array as $key => $item_f) {
                    $filter .= '<li><p>'.$key.':</p> <ul>';
                    foreach ($item_f as $f) {
                        $filter .= '<li data-id="'.$row["id"].'_'.$i.'" data-price="'.$tmp_filter[$f]["price"].'">'.$f.'</li>';
                        $i++;
                    }
                    $filter .= '</ul></li>';
                }
            }
            $filter .= '</ul>';

        }
    }
}

// PRICE
if(!empty($price)){
    $tpl->set('{price}', $price);
    $tpl->set('[price]', "");
    $tpl->set('[/price]', "");
} else{
    $tpl->set_block( "'\\[price\\](.*?)\\[/price\\]'si", "" );
}
// PRICE NOT
if(!empty($price)){
    $tpl->set_block( "'\\[not-price\\](.*?)\\[/not-price\\]'si", "" );
} else{
    $tpl->set('[not-price]', "");
    $tpl->set('[/not-price]', "");
}

// SALE
if(!empty($sale)){
    $tpl->set('{sale}', $sale);
    $tpl->set('[sale]', "");
    $tpl->set('[/sale]', "");
} else{
    $tpl->set_block( "'\\[sale\\](.*?)\\[/sale\\]'si", "" );
}
// SALE NOT
if(!empty($sale)){
    $tpl->set_block( "'\\[not-sale\\](.*?)\\[/not-sale\\]'si", "" );
} else{
    $tpl->set('[not-sale]', "");
    $tpl->set('[/not-sale]', "");
}

if(empty($price)){
    $link_add_to_cart = "";
    $link_go_payment = "";
}


$tpl->set('{price-sale}', $price_sale);
$tpl->set('{price}', $price);
$tpl->set('{sale}', $sale);
$tpl->set('{sale-type}', $sale_type);
$tpl->set('{count}', $count);
$tpl->set('{currency}', $ks_config["currency"]);
$tpl->set('{filter}', $filter);
$tpl->set('{count-orders}', $count_orders);
$tpl->set('{go-payment}', $link_go_payment);
$tpl->set('{add-cart}', $link_add_to_cart);
$tpl->set('{counter}', $counter_cart);
$tpl->set('{product}', $product);

$tpl->copy_template = str_replace('{filter}', $filter, $tpl->copy_template);
$tpl->copy_template = str_replace('{counter}', $counter_cart, $tpl->copy_template);