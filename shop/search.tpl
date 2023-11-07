<h1 class="title-1">Поиск по сайту</h1>

<div class="myform">
    
[simple-search]
<div class="form-group"><label>Введите слово(а) для поиска</label>{searchfield}</div>
<div class="clr">
<div class="col2 mb-0"><button type="button" class="button big color2 btn-block" name="dosearch" id="dosearch" onclick="javascript:list_submit(-1); return false;">Найти</button></div>
<div class="col2 mb-0"><button type="button" class="button big color btn-block" name="dofullsearch" id="dofullsearch" onclick="javascript:full_submit(1); return false;">Расширенный поиск</button></div>
</div>
[/simple-search]
    
[extended-search]
<div class="clr">
    
<div class="col2 mb-0">
    
<div class="form-group">
<label>Слова для поиска</label>
{searchfield}
</div>
    
<div class="form-group">
<label>Поиск по</label>
{search-area}
</div>
    
<div class="form-group">
<label>Искать статьи с комментариями</label>
<div class="clr">
<div class="col2 mb-0">{news-option}</div>
<div class="col2 mb-0">{comments-num}</div>
</div>
</div>
    
</div>
    
<div class="col2 mb-0">

<div class="form-group">
<label>Имя пользователя</label>
<div id="userfield">{userfield}</div>
</div>
    
<div class="form-group">
<label>Поиск по разделам</label>
{category-option}
</div>
    
<div class="form-group">
<label>Временной период</label>
<div class="clr">
<div class="col2 mb-0">{date-option}</div>
<div class="col2 mb-0">{date-beforeafter}</div>
</div></div>
    
</div></div>

<div class="form-group">
<label>Сортировка результатов</label>
<div class="clr">
<div class="col2 mb-0">{sort-option}</div>
<div class="col2 mb-0">{order-option}</div>
</div></div>

<div class="clr">
<div class="col3"><button type="button" class="btn btn-primary btn-block" name="dosearch" id="dosearch" onclick="javascript:list_submit(-1); return false;">Искать</button></div>
<div class="col3"><button type="button" class="btn btn-primary btn-block" name="doclear" id="doclear" onclick="javascript:clearform('fullsearch'); return false;">Сбросить</button></div>
<div class="col3"><button type="reset" class="btn btn-primary btn-block" name="doreset" id="doreset">Вернуть</button></div>
</div>

[/extended-search]
    
</div>

[searchmsg]<div class="berrors">{searchmsg}</div>[/searchmsg]