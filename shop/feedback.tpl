<h1 class="title-1">Обратная связь</h1>

<div class="berrors">
<b>Уважаемые посетители нашего сайта!</b><br>
У Вас есть вопрос, мы будем рады Вас выслушать и постараемся ответить.<br>
Мы оставляем за собой право не отвечать на реплики и не публиковать письма.<br> 
Рекомендуем не использовать ненормативную лексику, поскольку такие сообщения удаляются автоматически.
</div>

<div class="myform">
    
<div class="clr">

<div class="col2 mb-0"><div class="form-group">
<input placeholder="Ваше имя" type="text" maxlength="35" name="name" id="name" required>
</div></div>

<div class="col2 mb-0"><div class="form-group">
<input placeholder="Ваш E-mail" type="email" maxlength="35" name="email" id="email" required>
</div></div>

<div class="col2 mb-0"><div class="form-group">
<input placeholder="Тема сообщения" type="text" maxlength="45" name="subject" id="subject" required>
</div></div>

<div class="col2 mb-0"><div class="form-group">
{recipient}
</div></div>
    
</div>

<div class="form-group">
<textarea placeholder="Сообщение" name="message" id="message" rows="8" class="wide" required></textarea>
</div>

[attachments]
<div class="form-group">
<input name="attachments[]" type="file" class="pt-2" multiple>
</div>
[/attachments]

[recaptcha]
<div class="form-group">
{recaptcha}
</div>
[/recaptcha]

<button class="button big color2" type="submit" name="send_btn">Отправить сообщение</button>
    
</div>