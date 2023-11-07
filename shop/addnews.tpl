<h1 class="title-1">Добавить товар</h1>

<div class="myform">

<div class="form-group">
<label for="title" class="imp">Заголовок <span class="required">*</span></label>
<input type="text" name="title" id="title" value="{title}" class="wide" required>
</div>

[urltag]
<div class="form-group">
<label for="alt_name" class="imp">URL новости</label>
<input type="text" name="alt_name" id="alt_name" value="{alt-name}" class="wide">
</div>
[/urltag]
    
<div class="form-group">
<a href="#" class="button big color2 btn-block" onclick="$('.addvote').toggle();return false;">+ Добавить Опрос</a>
</div>

<div class="form-group addvote" style="display:none;">
<label for="vote_title" >Заголовок опроса</label>
<input type="text" name="vote_title" value="{votetitle}" class="wide" />
</div>

<div class="form-group addvote" style="display:none;">
<label for="frage">Вопрос</label>
<input type="text" name="frage" value="{frage}" class="wide" />
</div>
    
<div class="form-group addvote" style="display:none;">
<label for="vote_body" >Список ответов</label>
<textarea name="vote_body" rows="5" class="wide" placeholder="Каждая новая строка является новым вариантом ответа">{votebody}</textarea>
</div>

<div class="form-group">
<label for="category" class="imp">Категория <span class="required">*</span></label>
{category}
</div>
				
<div class="form-group">
<label for="short_story" class="imp">Краткое описание <span class="required">*</span></label>
[not-wysywyg]
<div class="bb-editor">
{bbcode}
<textarea name="short_story" id="short_story" onfocus="setFieldName(this.name)" rows="10" class="wide" required>{short-story}</textarea>
</div>
[/not-wysywyg]
{shortarea}
</div>

<div class="form-group">
<label for="full_story">Полное описание</label>
[not-wysywyg]
<div class="bb-editor">
{bbcode}
<textarea name="full_story" id="full_story" onfocus="setFieldName(this.name)" rows="10" class="wide" >{full-story}</textarea>
</div>
[/not-wysywyg]
{fullarea}
</div>

<div class="form-group">
<table style="width:100%">{xfields}</table>
</div>

<div class="form-group">
<label for="alt_name">Ключевые слова</label>
<input placeholder="Вводите через запятую" type="text" name="tags" id="tags" value="{tags}" maxlength="150" autocomplete="off" class="wide">
</div>

<div class="form-group">
<div class="admin_checkboxs">{admintag}</div>
</div>

[recaptcha]
<div class="form-group">
<label for="recaptcha">Защита от спама</label>
{recaptcha}
</div>
[/recaptcha]

<button class="button big color2" type="submit" name="add">Отправить</button>
<button class="button big color" onclick="preview()" type="submit" name="nview">Предпросмотр</button>
    
</div>