<?php
$this->pageTitle=Yii::app()->name . ' - Search';
$this->breadcrumbs=array(
		'Search',
);
?>
<style type="text/css">

#pagination-digg{border:0; margin:0; padding:0;}

#pagination-digg li{
border:0; margin:0; padding:0;
font-size:11px;
list-style:none;
margin-right:2px;
}
#pagination-digg a{
border:solid 1px #9aafe5
margin-right:2px;
}
#pagination-digg .previous-off,
#pagination-digg .next-off {
border:solid 1px #DEDEDE
color:#888888
display:block;
float:left;
font-weight:bold;
margin-right:2px;
padding:3px 4px;
}
#pagination-digg .next a,
#pagination-digg .previous a {
font-weight:bold;
} 
#pagination-digg .active{
background:#2e6ab1;
color:#FFFFFF;
font-weight:bold;
display:block;
float:left;
padding:4px 6px;
}
#pagination-digg a:link,
#pagination-digg a:visited {
color:#0e509e
display:block;
float:left;
padding:3px 6px;
text-decoration:none;
}
#pagination-digg a:hover{
border:solid 1px #0e509e
}
#spatial-ranger-box span{
	width: 60px;
	display: inline-block;
	text-align: right;
	padding-right: 5px;
}
#spatial-ranger-box input{
	width: 60px;
}
</style>
<h1>Search</h1>

<?php if(Yii::app()->user->hasFlash('search')): ?>

<div class="flash-success">
	<?php echo Yii::app()->user->getFlash('search'); ?>
</div>

<?php else: ?>
<form id="filter_form">
    <?php 
    foreach ($formItems as $field=>$items){
		$input_type="";
		if(in_array(strtolower($field), $form_radio)){
			$input_type = "checkbox";
		}
		if(in_array(strtolower($field), $form_checkbox)){
			$input_type = "checkbox";
		}
		if($input_type){
			echo '<div class="field">';
			echo '<div class="field-title">'.$field."</div>";
			foreach($items as $i=>$item){
				echo '<label for="'.strtolower($field).'_'.$i.'">';
				echo '<input type="'.$input_type.'" name="'.lcfirst($field).'" value="'.$item.'" id="'.strtolower($field).'_'.$i.'"/>'.$item;
				echo '</label>';
			}
			echo '</div>';
		}
	}
	if($temporalRange){
		$start_year = $temporalRange['start_year'];
		$int_start_year = intval($start_year);
		$end_year = $temporalRange['end_year'];
		$int_end_year = intval($end_year);
		$year_data = array();
		for($year = $int_start_year; $year<=$int_end_year; $year ++){
			$str_year = str_pad($year,4,"0",STR_PAD_LEFT);
			$year_data[$str_year]=$str_year;
		}
		$month_data = array();
		for($i=1;$i<=12;$i++){
			$str_month = str_pad($i,1,"0",STR_PAD_LEFT);
			$month_data[$str_month]=$str_month;
		}
		echo '<div class="field">';
		echo '<div class="field-title">TemporalRange</div>';
		echo '<label>';
		echo 'Start:';
		echo CHtml::dropDownList('temporalRange_year_start', '', $year_data,array('id'=>'temporalRange_year_start'));
		echo CHtml::dropDownList('temporalRange_month_start', '', $month_data,array('id'=>'temporalRange_month_start'));
		echo '</label>';
		
		echo '<label>';
		echo 'End:';
		echo CHtml::dropDownList('temporalRange_year_end', '', $year_data,array('id'=>'temporalRange_year_end'));
		echo CHtml::dropDownList('temporalRange_month_end', '', $month_data,array('id'=>'temporalRange_month_end'));
		echo '</label>';
		echo '</div>';
	}
    ?>
<div class="field-interaction">
	<INPUT type="button"  value="Search"  id="submit_g6"/>
	
	<INPUT type="reset" value="Reset"/>
</div>
</form>
<div class="step-box" id="mission-box">
	
</div>
<div style="clear: both;"></div>
<div class="step-box"  id="selected-box" style="display:none;">
	<h1 style="padding-top: 10px;">Selected</h1>
	<table class="data-table" id="selected-table">
	<tr>
		<th>institute</th>
		<th>model</th>
		<th>experiment</th>
		<th>ModelingRealm</th>
		<th>variableName</th>
		<th>ensembleMember</th>
		<th>temporalStart</th>
		<th>temporalEnd</th>
		<th></th>
	</tr>
	<TBODY id="selected-table-body">
		
	</TBODY>
	</table>
</div>
<div class="step-box"  id="param-box" style="display:none;">
	<form id="param_form">
		<div class="field">
			<label>
			Start:
			<SELECT name="temporalStart">
			</SELECT>
			</label>
			<label>
			End:
			<SELECT name="temporalEnd">
			</SELECT>
			</label>
		</div>
		<div class="field">
			Function:
			<?php echo CHtml::dropDownList('name', '', $nlcTypes ,array('id'=>'ncl-name'));?>
		</div>
		<div class="field" id="spatial-ranger-box">
			<div class="field-title">*Spatial Ranger</div>
			<div><span>North: </span><INPUT name="latMax"/></div>
			<div><span>South: </span><INPUT name="latMin"/></div>
			<div><span>West: </span><INPUT name="lonMin"/></div>
			<div><span>East: </span><INPUT name="lonMax"/></div>
		</div>
		<div class="field">
			Task Name:
			<INPUT name="taskName"/>
		</div>
		<div class="field">
			<INPUT type="button"  value="Submit Task"  id="submit_mission"/>
		</div>
	</form>
</div>
<script type="text/javascript">
	function updateform(fieldName,fieldItem,fieldChecked){
		// using regex to count the occurence of '=', representing number of checked checkboxes 
    	var filters = $('#filter_form').serialize();
		var checkedCount= (filters.match(/=/g) || []).length;	
		$.ajax({
			type: "POST",
            url: "<?php echo Yii::app()->createUrl('search/updateform')?>",
            data: {
                model:fieldName,
				value:fieldItem
                },
            dataType: "json",
            success: function(response){
                //alert(response);
				// get all corresponding filter items of that checkbox item
				var updatedFields=JSON.parse(response.updatedFields);
				var updatedFieldItems=updatedFields.data;
				// the first time when a checkbox is checked (only one checkbox is checked), turn all field items to grey
				if(checkedCount===1){
					$('#filter_form label').css('color','#d3d3d3');
				}		
				// for each filter item in the form, see if it's in the current checkbox's corresponding filter items
				$('#filter_form').children('.field').each(function() {
					var fieldTitle=$(this).children('div .field-title')[0].innerHTML;
					// first letter to lowercase to fit the interface
					fieldTitle=fieldTitle[0].toLowerCase() + fieldTitle.slice(1);
					var fieldOptions=updatedFieldItems[fieldTitle];
					$(this).children('label').each( function() {
						// add a data in field item DOM to determine how many times this item has been included according to the form checkbox selection
						var fieldLabel=$(this);
						// if includedtimes doesn't exist
						if(fieldLabel.is('[data-includedtimes]')){}
						else{
							fieldLabel.attr('data-includedtimes',0);
						}
						if(fieldOptions.includes(fieldLabel[0].innerText)){
							var includedtimes=Number(fieldLabel.attr('data-includedtimes'));
							if(fieldChecked){
								fieldLabel.attr('data-includedtimes', includedtimes+1);
							}
							else{
								fieldLabel.attr('data-includedtimes', includedtimes-1);
							}
						}
						// data included 0 times, set label color to grey, else black
						if(Number(fieldLabel.attr('data-includedtimes'))>0){
							fieldLabel.css('color','#555');
						}
						else{
							fieldLabel.css('color','#d3d3d3');
						}
					});
				});

				// no checkbox checked turn all to black
				if(checkedCount===0){
					$('#filter_form label').css('color','#555555');
				}
            },
            error:function(){
                alert('server error.');
            }
		});

	}
    function getList(page){
		<?php 
		foreach ($formItems as $field=>$items):
		?>
		<?php
		if(in_array(strtolower($field), $form_checkbox)){
			continue;
		}
		?>
		if(typeof $('input[name="<?php echo lcfirst($field);?>"]:checked').val() == 'undefined'){
			alert('<?php echo ucfirst($field);?> can not be blank.');
			$('input[name="<?php echo lcfirst($field);?>"]')[0].focus();
			return false;
		}
        <?php endforeach;?>
    	var filters = $('#filter_form').serialize();
		$.ajax({
			type: "POST",
            url: "<?php echo Yii::app()->createUrl('search/ajaxSearchList')?>",
            data: {
                filters:filters,
                page:page
                },
            dataType: "html",
            success: function(data){
                $('#mission-box').html(data);
            },
            error:function(){
                alert('server error.');
            }
		});
    }
    var compare_data = Array();
    function addToList(data){
    	if($.inArray(data,compare_data) >= 0){
			alert('This item has already selected.');
    	}
    	else{
    		compare_data[compare_data.length] = data;
    		showSelectedList();
    	}
    }
    function delFromList(data){
    	compare_data.splice($.inArray(data,compare_data),1);
    	showSelectedList();
    }
    var minDate = "0";
    var maxDate = "0";

    function setDateDrop(){
        var start_drop = $('select[name="temporalStart"]');
        var end_drop = $('select[name="temporalEnd"]');

        var now_start_value = start_drop.val();
        var now_end_value = end_drop.val();
        
        var min = parseInt(minDate);
        var max = parseInt(maxDate);
        start_drop.html('');
        end_drop.html('');
        for(var i = min; i<=max ;i++){
        	start_drop.append('<option value="' + pad(i,4) + '01' + '">' + pad(i,4)  + '</option>');
        	end_drop.append('<option value="' + pad(i,4) + '12' + '">' + pad(i,4)  + '</option>');
        }
        if(now_start_value){
        	start_drop.val(now_start_value);
        }
        if(now_end_value){
        	end_drop.val(now_end_value);
        }
    }
    
    function pad(num, n) {
	   	var i = (num + "").length;
	   	while(i++ < n) num = "0" + num;
	    return num;
   	}
    function showSelectedList(){
    	minDate = "0";
        maxDate = "0";
        if(compare_data.length>0){
        	$('#selected-box').show();
        	$('#param-box').show();
        	$('#selected-table-body').html('');
        	for(var i=0;i<compare_data.length;i++){
        		var json_data = $.parseJSON(compare_data[i]);
            	var html = '<tr>';
            	html += "<td>" + json_data['institute'] + "</td>";
            	html += "<td>" + json_data['model'] + "</td>";
				html += "<td>" + json_data['experiment'] + "</td>";
            	html += "<td>" + json_data['modelingRealm'] + "</td>";
				html += "<td>" + json_data['variableName'] + "</td>";
				html += "<td>" + json_data['ensembleMember'] + "</td>";
            	html += "<td>" + json_data['temporalStart'] + "</td>";
            	var min_year = json_data['temporalStart'].substr(0,4);
            	if(minDate == "0" || minDate>min_year){
                	minDate = min_year;
            	}
				html += "<td>" + json_data['temporalEnd'] + "</td>";
				var max_year = json_data['temporalEnd'].substr(0,4);
            	if(maxDate == "0" || maxDate<max_year){
            		maxDate = max_year;
            	}
				html += "<td><a href='#' data-content='" + compare_data[i] + "' class='unselect-link'>unselect</a></td>";
            	html += '</tr>';
        		$('#selected-table-body').append(html);
            }
        	setDateDrop();
        }
        else{
            $('#selected-box').hide();
            $('#param-box').hide();
        }
    }
	$(document).ready(function(){
		// fired when checkbox checked
		// get checkState, fieldName and fieldItem of that checkbox option
		$("input[type='checkbox']").click(function(){
			var filters = $('#filter_form').serialize();
			var checkedCount= (filters.match(/=/g) || []).length;
			// temporary solution : if an >=2nd checked field item is black(already included) then check/uncheck it doesn't affect anything
			// this won't cover the situation when: (a1,b1,c1) (a1,b2,c2) (a2,b2,c3)
			// first select a1, then select b1 and b2
			// the selection state should be (a1)&&(b1||b2) : (a1,b1,c1) (a1,b2,c2)
			// solution will return (a1||b2): (a1,b1,c1) (a1,b2,c2) (a2,b2,c3) which contains a2
			var includedtimes=0;
			if (this.parentElement.dataset.includedtimes){
				includedtimes= Number(this.parentElement.dataset.includedtimes);
			}
			if( (checkedCount>1 || (checkedCount==1&&!this.checked) ) && (includedtimes>0) ){}
			//update form
			else updateform(this.name,this.value,this.checked);
		});
		$('#submit_g6').click(function(){
			//submit search
			getList(0);
		});
		$('#mission-box').delegate('.select-link','click',function(){
			var data = $(this).attr('data-content');
			addToList(data);
			return false;
		});
		$('#mission-box').delegate('.pager-item','click',function(){
			var page = $(this).attr('data-page');
			getList(page);
			return false;
		});
		$('#selected-box').delegate('.unselect-link','click',function(){
			var data = $(this).attr('data-content');
			delFromList(data);
			return false;
		});
		$('#submit_mission').click(function(){
			<?php 
			if(MenuLoader::isGuest()):
			?>
				alert("You can't submit search task without login.");
				location.href="<?php echo Yii::app()->createUrl('site/login');?>";
			<?php 
			else :
			?>
			var data = {};
			data.items = compare_data;
			data.start = $('select[name="temporalStart"]').val();
			data.end = $('select[name="temporalEnd"]').val();
			data.latMin = $('input[name="latMin"]').val();
			data.latMax = $('input[name="latMax"]').val();
			data.lonMin = $('input[name="lonMin"]').val();
			data.lonMax = $('input[name="lonMax"]').val();
			data.name = $('#ncl-name').val();
			data.taskName = $('input[name="taskName"]').val();
			$.ajax({
				type: "POST",
	            url: "<?php echo Yii::app()->createUrl('search/ajaxSubmit')?>",
	            data: data,
	            dataType: "json",
	            success: function(data){
	                if(data.success){
	                	alert(data.msg);
	                	location.href="<?php echo Yii::app()->createUrl('user/index')?>";
	                }
	                else{
		                alert(data.msg);
	                }
	            },
	            error:function(){
	                alert('server error.');
	            }
			});
			
			<?php 
			endif;
			?>
		});
	});
</script>
<?php endif; ?>
