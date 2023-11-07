<?php
if( !defined('DATALIFEENGINE') ) {
	header( "HTTP/1.1 403 Forbidden" );
	header ( 'Location: ../../' );
	die( "Hacking attempt!" );
}

include ('engine/api/api.class.php');


// подключаем функции
include (DLEPlugins::Check(ENGINE_DIR . '/modules/kylshop/init.php'));

if(!empty($_POST["pay_balance"]) && $ks_config["payments_balance"] && $member_id['user_group'] != '5'){

    include (DLEPlugins::Check(ENGINE_DIR . '/modules/kylshop/payments/pay_balance.php'));

} else{

    $tpl -> load_template( 'kylshop/cart.tpl' );

    // Таблица с товарами
    $goods = '<table class="cart_table"></table>';
    $total = '<p class="ks_total_cart">Всего: <b>0 '.$ks_config["currency"].'</b></p>';
    $method_total = '';
    $total_without_method = '';


// применение промо-кода
    if(!empty($_POST["promo_code"])){

        $code = trim(htmlspecialchars(strip_tags(addslashes($_POST["promo_code"]))));
        $goods = json_decode($_POST["goods"], true);

        $where = "";
        foreach ($goods as $good) {
            $where .= "id = '{$good["id"]}' OR ";
        }
        $where = substr($where, 0, -4);

        $news = $db->super_query("SELECT id, category, kylshop, price FROM " . PREFIX . "_post WHERE {$where}", true);

        if(!empty($news)){

            $total = 0;

            // убираем сперва категории не попадающие под действие промо-кода
            if(!empty($ks_config["promo_no_cats"])){

                $promo_no_cats = explode(",", $ks_config["promo_no_cats"]);

                foreach ($news as $key => $row) {

                    if(strripos($row["category"], ",") !== false){

                        $cats = explode(",", $row["category"]);
                        foreach ($cats as $cat) {

                            if(array_search($cat, $promo_no_cats) !== false){

                                $total_ = floatval($row["price"]);
                                $rowKylshop = unserialize($row["kylshop"]);
                                if(!empty($rowKylshop["ks_sale"])){
                                    if($rowKylshop["ks_sale_type"] == "%"){
                                        $total_ = $row["price"] - ($row["price"] * intval($rowKylshop["ks_sale"])) / 100;
                                    } else{
                                        $total_ = $row["price"] - floatval($rowKylshop["ks_sale"]);
                                    }
                                }
                                $total += $total_;
                                unset($news[$key]);
                            }
                        }

                    } else{

                        if(array_search($row["category"], $promo_no_cats) !== false){

                            $total_ = floatval($row["price"]);
                            $rowKylshop = unserialize($row["kylshop"]);
                            if(!empty($rowKylshop["ks_sale"])){
                                if($rowKylshop["ks_sale_type"] == "%"){
                                    $total_ = $row["price"] - ($row["price"] * intval($rowKylshop["ks_sale"])) / 100;
                                } else{
                                    $total_ = $row["price"] - floatval($rowKylshop["ks_sale"]);
                                }
                            }
                            $total += $total_;
                            unset($news[$key]);
                        }
                    }
                }
            }

            // смотрим какие товары со скидкой уже
            if(empty($ks_config["promo_in_sale"])){
                foreach ($news as $key => $row) {
                    $rowKylshop = unserialize($row["kylshop"]);
                    if(!empty($rowKylshop["ks_sale"])){
                        if($rowKylshop["ks_sale_type"] == "%"){
                            $total_ = $row["price"] - ($row["price"] * intval($rowKylshop["ks_sale"])) / 100;
                        } else{
                            $total_ = $row["price"] - floatval($rowKylshop["ks_sale"]);
                        }
                        $total += floatval($total_);
                        unset($news[$key]);
                    }
                }
            }

            // применять промо-код для каждого товара
            /*if(empty($ks_config["promo_in_sale"])){
                foreach ($news as $row) {
                    $rowKylshop = unserialize($row["kylshop"]);
                    if(!empty($rowKylshop["ks_sale"])){

                    }
                }
            }*/
        }

        $code_row = $db->super_query("SELECT id, code, sale FROM " . PREFIX . "_promocodes WHERE `code` = '{$code}' AND `status` != '0' AND term >= '".time()."'");

        if(!empty($code_row)){

            foreach ($news as $row) {
                $total += floatval($row["price"]) * $goods[$row["id"]]["count"];
            }

            if(strripos($code_row["sale"], "%") !== false){
                $percent = trim($code_row["sale"], "%");
                $total = $total - ($total * $percent) / 100;
            } else{
                $total = $total - floatval($code_row["sale"]);
            }

            echo $total.':'.(is_numeric($code_row["sale"]) ? $code_row["sale"].' '.$ks_config["currency"] : $code_row["sale"]);
        }
        else echo 'no';

        exit;
    }


// обработчик - оплата
    if($_SERVER["REQUEST_METHOD"] == "POST" || !empty($_GET["payment"])) include (DLEPlugins::Check(ENGINE_DIR . '/modules/kylshop/payment.php'));

// перенаправляем на главную если это гость и ему запрещено покупать
    if($member_id["user_group"] == "5" && $ks_config["payment_guest"] == false){
        header("Location: " . $config["http_home_url"]);
        exit;
    }

    $script_on_submit = '';
    $form_display = true;
// если выключено добавление в корзину
    if($ks_config["add_to_cart"] != true && $_SERVER["REQUEST_METHOD"] != "POST"){
        $script_on_submit = 'setTimeout(function(){
        $("#ks_form").submit();
    }, 3000)';
        $form_display = false;
    }


    $fields = $delivery_map = "";
// перебор созданных полей
    if(file_exists(ENGINE_DIR . "/modules/kylshop/fields.json")){

        $fields_source = json_decode(file_get_contents(ENGINE_DIR . "/modules/kylshop/fields.json"), true);

        $fieldsTags = [];

        foreach ($fields_source as $key => $item) {

            $required = $post = $power = $val = '';
            $type = 'text';
            if(!empty($item["required"])) $required = ' required';
            if(!empty($item["power"])) $power = ' checked';

            $attr = '';
            if(!empty($item["attr"])) $attr = ' ' . str_replace('*', "'", $item["attr"]);

            switch ($item["type"]){

                case "input":

                    if(strripos($item["title"], "E-mail") !== false || strripos($item["title"], "Email") !== false || strripos($item["title"], "email") !== false){

                        $keySource = $key;
                        if($member_id["user_group"] == "5"){

                            $type = "email";
                            $key = 'email';

                        } else{

                            $key = 'email';
                            $type = "hidden";
                            $val = ' value="' . $member_id["email"] . '"';
                        }
                    }

                    if($ks_config["label"] == true){
                        $fields .= $fieldsTags[$keySource] = '<div class="ks_field">
                            <label for="ks_'.$key.'">'.$item["title"].'</label>
                            <input type="'.$type.'" name="'.$key.'" id="ks_'.$key.'"'.$val.$required.$attr.'>
                        </div>';
                    } else{
                        $fields .= $fieldsTags[$keySource] = '<div class="ks_field">
                            <input type="'.$type.'" name="'.$key.'" placeholder="'.$item["title"].'"'.$val.$required.$attr.'>
                        </div>';
                    }


                    break;

                case "textarea":

                    if($ks_config["label"] == true){
                        $fields .= $fieldsTags[$key] = '<div class="ks_field">
                            <label for="ks_'.$key.'">'.$item["title"].'</label>
                            <textarea name="'.$key.'" id="ks_'.$key.'"'.$required.$attr.'></textarea>
                        </div>';
                    } else{
                        $fields .= $fieldsTags[$key] = '<div class="ks_field">
                            <textarea name="'.$key.'" placeholder="'.$item["title"].'"'.$required.$attr.'></textarea>
                        </div>';
                    }
                    break;

                case "select":

                    $delivery_class = '';
                    // если находим похожую хрень, то подгружаем карту
                    if(stripos(mb_strtolower($item["admin"], 'UTF-8'), "доставки*") !== false || stripos(mb_strtolower($item["admin"], 'UTF-8'), "доставка*") !== false){
                        $delivery_map = true;
                        $delivery_class = 'is_delivery_select';
                    }

                    $options_source = explode(PHP_EOL, $item["values"]);
                    $options = "";
                    foreach ($options_source as $option) {
                        if(!empty($option))
                            $options .= '<option value="'.trim($option).'">'.trim($option).'</option>';
                    }

                    if($ks_config["label"] == true){
                        $fields .= $fieldsTags[$key] = '<div class="ks_field">
                            <label for="ks_'.$key.'">'.$item["title"].'</label>
                            <select name="'.$key.'" id="ks_'.$key.'" class="'.$delivery_class.'"'.$required.$attr.'>
                                '.$options.'
                            </select>
                        </div>';
                    } else{
                        $fields .= $fieldsTags[$key] = '<div class="ks_field">
                            <select name="'.$key.'" class="'.$delivery_class.'"'.$required.$attr.'>
                                <option value="" selected disabled>'.$item["title"].'</option>
                                '.$options.'
                            </select>
                        </div>';
                    }
                    break;

                case "checkbox":

                    $fields .= $fieldsTags[$key] = '<div class="ks_field nlb">
                        <input type="checkbox" name="'.$key.'" id="ks_'.$key.'"'.$required.$power.$attr.'>
                        <label for="ks_'.$key.'">'.$item["title"].'</label>
                    </div>';
                    break;

                case "file":

                    $fields .= $fieldsTags[$key] = '<div class="ks_field">
                        <label for="ks_'.$key.'">'.$item["title"].'</label>
                        <input type="file" name="'.$key.'[]" multiple id="ks_'.$key.'"'.$required.'>
                    </div>';
                    break;

            }
        }


        // если нет тега {form} значит должны быть отдельные теги элементов
        if (stripos($tpl->copy_template, "{form}" ) === false) {

            //$tpl->copy_template = preg_replace( "/\{_([0-9]+)\}/is", "{$fieldsTags["$1"]}", $tpl->copy_template );
            preg_match_all( "/\{_([0-9]+)\}/is", $tpl->copy_template, $allFields );

            if(!empty($allFields[1])){
                foreach ($allFields[1] as $allField) {
                    $tpl->set("{_{$allField}}", $fieldsTags[$allField]);
                }
            }
        }
    }


    $method = $method_input = $total_without_method = '';
    if($ks_config["method"] == true && file_exists(ENGINE_DIR . "/modules/kylshop/method.json")) {

        $method_ks = explode("|", $ks_config["method_title"]);

        $method_total = '<p class="method_total">'.trim($method_ks[1]).': <b>0 '.$ks_config["currency"].'</b></p>';
        $total_without_method = '<p class="total_without_method">Всего: <b>0 '.$ks_config["currency"].'</b></p>';

        $method_data = json_decode( file_get_contents( ENGINE_DIR . "/modules/kylshop/method.json" ), true );

        if(!empty($method_data)){
            $method .= '<select id="extra_method">
		<option value="0" selected disabled>-- '.trim($method_ks[0]).' --</option>';

            foreach ( $method_data["method_name"] as $method_key => $method_datum ) {

                $method .= '<option value="'.$method_datum.'" data-price="'.$method_data["method_price"][$method_key].'" data-max_sum="'.$method_data["method_max_price"][$method_key].'">'.$method_datum.'</option>';
            }

            $method .= '</select>';

            $method_input = '<input type="hidden" name="extra_method" value="" required>';
        }
    }


    $payment = 'Оформить заказ';
    if($ks_config["payments_power"] == true){
        // значит пользователь только собирается перейти на страницу с выбором способа оплаты
        $payment = 'Перейти к оплате';
    }

    if($_SERVER["REQUEST_METHOD"] == "POST" || !empty($_GET["payment"])) $method = $method_input = $total_without_method = $method_total = $total = '';

    // форма заказа
    $form = '<form action method="POST" enctype="multipart/form-data" id="ks_form">
        '.$fields.'
        <div class="clr"></div>
        <input type="hidden" name="goods" id="goods_ks" value="">
        <input type="hidden" name="payment_start" value="1">
        '.$method_input.'
        <input type="submit" id="ks_payment" value="'.$payment.'">
    </form>';


    $tpl -> set('{form_start}', '<form action method="POST"  enctype="multipart/form-data" id="ks_form">');
    $tpl -> set('{form_end}', '<div class="clr"></div>
        <input type="hidden" name="goods" id="goods_ks" value="">
        <input type="hidden" name="payment_start" value="1">
        '.$method_input.'
        <input type="submit" id="ks_payment" value="'.$payment.'">
    </form>');


// если у нас есть переменная $payment_init значит вместо корзины выводим все кнопки и формы, которые нам передал файл payment.php
    if(!empty($payment_init)){
        $goods = $payment_init;
        $form = "";
    }

    $redirect_pay = $before_cart = $after_cart = '';
    if($form_display === false){
        $redirect_pay = '<p class="redirect_payments">Перенаправление на страницу с выбором оплаты через 3 сек...</p>';
        $before_cart = '<div style="display:none!important;">';
        $after_cart = '</div>';
    }



// если включена карта
    if($ks_config["delivery_power"] == true && $delivery_map){

        $delivery_data = $db->super_query( "SELECT marker_id, coords, title, description FROM " . PREFIX . "_kylshop_delivery", true );
        $delivery_data = json_encode($delivery_data, JSON_UNESCAPED_UNICODE);

        $map = $ks_config["text_over_map"].'<div id="ks_map" data-config=\''.$ks_config["delivery_mapInfo"].'\' data-markers=\''.$delivery_data.'\' data-city=\''.str_replace("\n", "|", $ks_config["delivery_city"]).'\'></div>';
    }



    $promo = '';
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        $promo = '<input type="text" name="promo" id="promo_code" placeholder="Промо-код" autocomplete="off">
	<a href="#" id="apply_promo_code" class="button big color2">Применить</a>';
    }

    $without_sale = '<span class="without_sale"></span>';



    $tpl -> set('{cart}', $redirect_pay.$before_cart.$goods.$after_cart); // корзина - обертка
    $tpl -> set('{total}', $total); // Всего - обертка
    $tpl -> set('{method-total}', $method_total); // Сумма за доставку - обертка
    $tpl -> set('{without-method}', $total_without_method); // Всего с доставкой - обертка
    $tpl -> set('{form}', $before_cart.$form.$after_cart);
    $tpl -> set('{method}', $method);
    $tpl -> set('{map}', $map);
    $tpl -> set('{promo-code}', $promo);
    $tpl -> set('{without-sale}', $without_sale);
    $tpl -> compile( 'content' );
    $tpl -> clear();
}