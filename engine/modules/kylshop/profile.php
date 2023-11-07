<?php
/**
 * @name товары пользователя
 */
if( !defined('DATALIFEENGINE') ) {
    header( "HTTP/1.1 403 Forbidden" );
    header ( 'Location: ../../' );
    die( "Hacking attempt!" );
}

// подключаем функции
include (DLEPlugins::Check(ENGINE_DIR . '/modules/kylshop/init.php'));

$my_goods = $db->super_query( "SELECT * FROM " . PREFIX . "_kylshop_buy WHERE user_id = '{$row["user_id"]}' ORDER BY id DESC", true );

$goods_result = '<h3>Вы ещё не совершали покупку на сайте</h3>';

if(!empty($my_goods)){

    $goods_result = '<h3 class="gp-title-1">Мой список заказов</h3>
    <table class="table_goods">
        <tr>';
    $goods_result .= $ks_config["show_number"] ? '<th width="120">ID заказа</th>' : '';
    $goods_result .= $ks_config["show_goods"] ? '<th width="60%">Товары</th>' : '';
    $goods_result .= $ks_config["show_total"] ? '<th>Сумма</th>' : '';
    $goods_result .= $ks_config["show_date"] ? '<th>Дата</th>' : '';
    $goods_result .= $ks_config["show_status"] ? '<th width="100" class="tc">Статус</th>' : '';
    $goods_result .= '</tr>';

    foreach ($my_goods as $my_good) {

        $goods = json_decode($my_good["goods"], true);

        $goods_all = "";
        foreach ($goods as $good) {
            $goods_all .= '<a href="'.$good["link"].'" target="_blank">'.' '.$good["title"].' ('.$good["count"].' '.$ks_config["unit"].')</a><br>';
        }

        $status = "Ожидает оплаты";
        $status_class = "";

        if($my_good["status"] == "1"){
            $status = "Оплачен";
            $status_class = "1";
        } else if($my_good["status"] == "2"){
            $status = "На модерации";
            $status_class = "2";
        } else if($my_good["status"] != "0"){
            $status = $my_good["status"];
            $status_class = "3";
        }


        $goods_result .= '<tr>
            <td><b>'.$my_good["order_code"].'</b></td>
            <td>'.$goods_all.'</td>
            <td><b>'.$my_good["total"].' '.$ks_config["currency"].'</b></td>
            <td>'.date("d.m.Y H:i", $my_good["time"]).'</td>
            <td class="tc status_'.$status_class.'">'.$status.'</td>
        </tr>';
    }

    $goods_result .= '</table>';
}

$tpl->set('{my_goods}', $goods_result);