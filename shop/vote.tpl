<div class="p-3 bg-light rounded"><h5 class="mb-0" >{title}</h5></div>

[votelist]
<form method="post" name="vote">
[/votelist]

<div class="vote_list">{list}</div>

[voteresult]
<div class="vote_votes grey">Проголосовало: {votes}</div>
[/voteresult]

[votelist]
<input type="hidden" name="vote_action" value="vote">
<input type="hidden" name="vote_id" id="vote_id" value="{vote_id}">
<button class="button color2 big btn-block" style="margin-bottom:10px" type="button" onclick="doVote('vote'); return false;">Голосовать</button>
<button class="button color big btn-block" type="button" onclick="doVote('results'); return false;">Результаты</button>

</form>
[/votelist]