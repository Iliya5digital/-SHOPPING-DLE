[not-group=5]
<div class="user-links">
<div class="user-icon" title="Мой профиль"><i class="las la-user"></i></div>
<div class="user-body">
<img class="user-body-photo" src="{foto}" alt="img"><br>
Приветствуем, <b>{login}</b><br>
<span class="user-body-a">
<a href="{profile-link}">Мой профиль</a> / <a href="{logout-link}">Выход</a>
</span>
<br><span class="user-body-a">
<a href="{pm-link}">Сообщения</a> / <a href="{addnews-link}">Опубликовать</a>
</span>
<br><br>
<a href="/?do=cart" class="button medium color2">Корзина</a>
<a href="{favorites-link}" class="button medium color">Избранное ({favorite-count})</a> 
</div></div>
[/not-group]

[group=5]
<div class="user-links">
<div class="user-icon" title="Мой профиль"><i class="las la-user"></i></div>
<div class="user-body">
<img class="user-body-photo" src="{THEME}/images/nophoto.png" alt="img"><br>
Приветствуем, <b>Гость</b><br>
<span class="user-body-a">
<a href="{lostpassword-link}">Восстановить</a> / <a href="{registration-link}">Регистрация</a>
</span>
<br><br>
<a href="#" onclick="show_modal_dle();" class="button medium color2 btn-block">Войти</a>
</div></div>
<div id="div_modal_dle" title="Авторизация" style="display:none;">
<form name="login-form" id="loginform" method="post">
<div class="form-group">
<label for="user_login">Логин</label>
<input type="text" name="login_name" id="login_name" value="">
</div>
<div class="form-group">
<label for="user_pass">Пароль</label>
<input type="password" name="login_password" id="login_password">
</div>
<div class="form-group mb-0">
<input type="submit" class="button big color2 btn-block" value="Войти">
<input name="login" type="hidden" id="login" value="submit">
</div>
</form>
</div>
[/group]