
var ____mselect_css=`
.mselect .item.active{
    background: #a0a0a0
 }

 .mselect .optionLabel {
    height:1.5em;
    line-height:1.5em;
    border-radius:.7em;
    background: #f0f0f0;
    border:1px solid #d0d0d0;
    padding:.1px .5em;
    margin:0px .2em;
    display:inline-block;
 }

 .mselect .optionArea {
    position:absolute; 
    display:none; 
    border:1px solid  #ced4da; 
    border-top:none;
    z-index:999;
    max-height:10em;
    overflow-y:auto;
 }

 .mselect .inputArea {
      border:1px solid  #ced4da; 
      max-height:10em;
      overflow:auto;
  }

  .mselect .inputselect, .mselect .inputselect:focus {
     -webkit-appearance: none; box-shadow: none !important; 
     display:inline-block; width:95%;
     outline:none; border:none; 
     padding:0px .5em;
     text-overflow: ellipsis;
     color:#a0a0a0;

  }

  .mselect .inputLabelArea {
    -webkit-appearance: none; box-shadow: none !important; 
    display:inline-block; width:95%;
    outline:none; border:none; 
    padding:0px .5em;
    text-overflow: ellipsis;
    color:#a0a0a0;
  }
  `;

/**
 * 
 * 1   from select
 * 实例化
 * mselectify( $("[name='dimensions']",  container).get(0 ));
 * 
 * 2  from input
 *  设置 kvs 数组
 *  $( '[name="filter"] [name="adx"]', container ) .data( "kvs", [ { k: "Adx1", v: "adx1"}, { k: "Adx2", v: "adx2"} ]);
 *  设置数据分割符
    $( '[name="filter"] [name="adx"]', container ).data ( "split", ":" );
    实例化
    mselectify( $( '[name="filter"] [name="adx"]', container )  );
 * 
 */
var mselectId="__________________mselect";
function  mselectify ( targetEle ,optionId) {
    var mselectCssDiv = document.getElementById(  mselectId );
    if ( null==  mselectCssDiv ) {
        $( document.body).append( "<div id='" + mselectId + "' ></div>" );
        $( "#" + mselectId ).append( "<style type='text/css' >" + ____mselect_css  +"</style>");
    }

    var  mselectInstance = new _mselectify ( targetEle, optionId );
    mselectInstance.init();
}

function _mselectify(  targetEle, optionId ) {
    this.targetEle= targetEle;
    $(this.targetEle ).attr( "multiple", "" );
    this.parentNode = $( targetEle).parent();
    this.targetHeight = $( targetEle).height();
    $( this.parentNode) .css( "position", "relative" );
    this.targetId =  new Date().getTime() +"_"  +  Math.floor( Math.random( ) * 10000  );
    $( this.targetEle).data("target",  this.targetId );
    
    this.optionAreaId =  optionId ||  ("option_"+   this.targetId );
    this.inputEleId =  "input_"+   this.targetId;
    this.newControlId = "text_" +  this.targetId;
    this.maxOptions =parseInt(  $( targetEle).attr("data-maxOptions" ) || "99" );

  
}

_mselectify.prototype= {
    targetEle: null, 
    targetId: null, 
    targetType: "select", //select or  input
    inputSplit: ",", //当targetType 为 input 时，多值使用分割符号
    optionAreaId: null, 
    inputEleId: null,
    newControlId: null,
    parentNode: null,
    kvs: [], 
    vkMap: {},

    renderOptionLablel: function( selectedKvs ) {
        console.log("SelectKv:"+  JSON.stringify(  selectedKvs ) );
        if ( 'select' == this.targetType ) {
            $( "#" + this.inputEleId ).html(  selectedKvs.map( kv=> {
                return "<span class='optionLabel'  >"  + kv.k + " <span v='"  + kv.v + "'name='delMoption' >| ✕</span></span>" ;
            }).join( ""));
        }else {
            $( "#" + this.inputEleId ).val(  selectedKvs.map( kv=> {
                return   kv.v ;
            }).join(  this.inputSplit ));
        }
    },

    setValue: function( values ) {
        console.log("SetVal:"+   JSON.stringify(  values ) );
        if ( 'select' == this.targetType ) {
            if (  values && values.substr ) {
                values =  [  values ];
            }
            $( this.targetEle).val(  values );
        }else {

            if ( !values || values.length ==0 ) {
                $( this.targetEle).val( "" );
            }else {
                var  result =[];
                for( var k in values ) {
                    if ( !values[k ] ) {
                         continue;
                    }
                    if(  result.includes(   values[k ]) ){
                        continue;
                    }     
                    result .push(  values[ k] );           
                }
                console.log( "SetValue:"+  JSON.stringify(  values ) );
                $( this.targetEle).val(  result.join(  this.inputSplit ) );
                //$( this.targetEle).get(0).title = $( this.targetEle).val();
            }
        }
    }, 

    
    triggleOptionRender:  function() {

        var mselectInstance = this;
        var optionUl = $( '[name="optionUl"]', "#" + this.optionAreaId );
        //var selectedVal =this.val();
        var selectedVal = this.val();
         

        $( "li", optionUl).each( function() {
            var v = $( this).attr("value" );
            var checked = selectedVal.includes(  v) ;
            $( this) .css( "display",  checked ? "none": "" );
            $( this).data( "checked",  checked );
        } );

        var selectedKvs = selectedVal.map(  v=> {
            return { k:  mselectInstance.vkMap[ v],  v: v   };
        });
           

        var selectedVal =this.val();
        // $( "#" + this.inputEleId ).html(  selectedKvs.map( kv=> {
        //     return "<span class='optionLabel'  >"  + kv.k + " <span v='"  + kv.v + "'name='delMoption' >| ✕</span></span>" ;
        // }).join( ""));
        this.renderOptionLablel(  selectedKvs );

        if ( "input" ==this.targetType ) {
            $( "#" + this.inputEleId ).on( 'change', function(){
                var vals = mselectInstance.vkMap;
                var options = this.value.replace( /\s/g, "").split(  mselectInstance.inputSplit );
                mselectInstance.setValue ( options );
                mselectInstance.triggleOptionRender();

            });
        }

        $(  '[name="delMoption"]', "#" + this.inputEleId ).off().click( function() {
            $( this).parents( '.optionLabel') .remove();
            var newVal = $(  '[name="delMoption"]', "#" + mselectInstance.inputEleId ).get().map( x => {
                return $(  x).attr( 'v' );
            });
            console.log("NewVal:"+ JSON.stringify(  newVal ) );
            $( mselectInstance.targetEle ).val(newVal );
            mselectInstance.triggleOptionRender();
        });


        var filterTextVal = $( '[name="optionFilterText"]', "#" + this.newControlId ).val().trim().toLowerCase();
        $("[name='optionUl'] li:gt(1)",  "#" + this.newControlId ).each( function(index, ele ) {
            var checked = $( ele).data( "checked" );
            var  labelText =  $(ele).text().toLowerCase();

            console.log("checkOption:"+ labelText+"," +  checked  +", " +  typeof(  checked));
            if ( true === checked ) {
                return;
            }

            $( this ) .css(  "display",   labelText.indexOf(  filterTextVal )!= -1 ? "": "none" );
        });

     },

      

    val: function() {

        var values = $( this.targetEle ) .val();
        if ( 'select' == this.targetType ) {
            //return values;
        }else {
            if ( !values || values.length ==0 ) {
                return  [];
            }else {
                return  values.split(  this.inputSplit ) ;
            }
        }


        var  targetVal = values;
        targetVal = targetVal === null? [] : (
            targetVal.substring?  [ targetVal] : targetVal
        );
        return targetVal ||[];
    },

    init: function() {

    var mselectInstance = this;
    var  parentNode = this.parentNode;
    var targetEle=  this.targetEle;
    var targetHeight = $( targetEle).height();
    $( parentNode) .css( "position", "relative" );
    var  targetId =  this.targetId;
    $( targetEle).data("target",  targetId );

    this.targetType = $( targetEle).get(0).tagName.toLowerCase();
    
    var optionAreaId = this.optionAreaId;
    var inputEleId =  this.inputEleId;
    var newControlId =  this.newControlId;

    var  targetVal =  $( targetEle).val();
    targetVal = targetVal == null? [] : (
        targetVal.substring?  [ targetVal] : targetVal
    );

    var optionKvs = [];
    if ( "select" == this.targetType ) { 
        optionKvs= $("option",  targetEle).get().map( x=> {
            return { v:  x.value,  k:$(x).text() };
        });
    }else {
        optionKvs= $(targetEle ).data( "kvs" );
        this.inputSplit = $(targetEle ).data( "split" )|| this.inputSplit;
    }
    this.kvs = optionKvs;
    for (var i in this.kvs) {
        var  kv = this.kvs[ i];
        this.vkMap[  kv.v ]  = kv.k;
    }

    console.log( "selectInfo:" +  JSON.stringify( this.kvs ) );

    var inputEle = "<span id='"  + inputEleId + "'  style='display:inline-block; height:1.5em; width:100%;'  class='noDefault'  ></span>" ;
    if ( "input" == this.targetType ) {
        inputEle= "<input type='text'  id='"  + inputEleId + "'  style='display:inline-block; height:1.5em; width:100%;'  class='inputLabelArea'  />" ;
    }

    
    var newSelectHtml = 
    "<div class='form-control mselect inputArea' style='position:relative; ' id='"  + newControlId +"'>" +
        inputEle  + 
     "<div  class='optionArea'  id='" +  optionAreaId + "' > " + 
            "<div style='height:0.8em' ></div>" + 
            "<ul  style='list-style-type:none; padding:0px; margin:0px;background:white' name='optionUl'>" + 
                "<li  styl='list-style-stype:none; height:" + targetHeight+ "px;' ></li>" + 
                "<li ><input type='text'  class='inputselect' name='optionFilterText'  placeHolder='> ...'  /></li>" +
                optionKvs.map( option=> {
                    return "<li value='"  + option.v+ "'  style='padding:.1em .5em' class='item'> "  +  option.k+ "</li>" 
                }).join("")  + 
            "</ul>"  + 
        "</div>" + 
        "</div>";
     

    $( newSelectHtml).insertAfter(  targetEle );

    $( '[name="optionFilterText"]', "#" + newControlId ).on( 'input', function( event ) {
        var filterTextVal = this.value.trim().toLowerCase();
        $("[name='optionUl'] li:gt(1)",  "#" + newControlId ).each( function(index, ele ) {
            var checked = $( ele).data( "checked" );
            if ( "true"== checked ) {
                return;
            }
            var  labelText =  $(ele).text().toLowerCase();
            $( this ) .css(  "display",   labelText.indexOf(  filterTextVal )!= -1 ? "": "none" );
        });

        mselectInstance.triggleOptionRender();
    });

    $( "li",  "#" + newControlId).hover(function() {
        $( "li",  "#" + newControlId).removeClass( "active");
        $( this) .addClass( "active");
    });

    $( "li",  "#" + newControlId).off().click(function() {
        var itemV = $( this).attr("value" );



        var  targetVal =  mselectInstance.val();
        if ( targetVal.length >= mselectInstance.maxOptions) {
            alert("Selection no many that: " +   mselectInstance.maxOptions );
            return;
        }
        targetVal.push(  itemV );
        console.log("Select:"+  itemV + ", result:" +   JSON.stringify(  targetVal  ) );

          
        //$( targetEle ).val(   targetVal );
        mselectInstance.setValue(  targetVal );
        mselectInstance.triggleOptionRender();
        if ( "select" == mselectInstance.targetType ) { 
            $( '[name="optionFilterText"]', "#" + newControlId ).focus();
        }

       
        
    });

   // $( "#" + optionAreaId).css( "width", $( targetEle).width() );

    $("#" + inputEleId).click( function( event ) {
        //if ( "select"  == mselectInstance.targetType ) {
            event.preventDefault();
        //}
        

        var  targetVal =  mselectInstance.val();
        console.log("CheckedWhenShow:"+  JSON.stringify(  targetVal ) );
    

        $( 'li', "#" + newControlId ).each( function( index, ele )  {
            console.log( "CheckVal:"+  $( this).attr( "value" ) );
            $( this).css( "display", 
                targetVal.includes(  $( this).attr( "value")) ? "none": ""
            );
        });

        //alert( "CalcWdith:"+ "calc( " + $( "#" + newControlId).width() + "px+ 1em) ");
        $( "#" + optionAreaId).css(  {  
            "margin-left":"-0.8em",  
            "display": "block" , 
            "width":   "calc( " + $( "#" + newControlId).width() + "px + 1.6em)"  });
        //$("#"  + textAreaId ).css("display", "" ) ;
        //$("#" + optionAreaId) .css("display", "" );
        if ( "select"  == mselectInstance.targetType ) {
            $( '[name="optionFilterText"]', "#" + newControlId ).focus();
        }
        $( '[name="optionFilterText"]', "#" + newControlId ).val( "");

    });
    
    $("#" + optionAreaId).blur( function() {
        console.log( "OptionAreaBlure" );
        $("#" + optionAreaId ).css( "display", "none" );
        $("#"  + textAreaId ).css("display", "none" ) ;
    });

    $( targetEle).css( "display", "none" );
    
    $( window).click(  function( event ) {
        var eventTarget=  event.target;
        console.log("ClickElement:"+  eventTarget.tagName  +"," + $( eventTarget).parent().get(0).id  + ", dst:"+ newControlId);
        var newControlEle = $(  eventTarget).parents().filter( function( index ){
            
            console.log( " Id:"+ $( this).attr("id") +"==" + newControlId  + ( $( this).attr("id") == newControlId));
            return  $( this).attr("id") == newControlId;
        }).get(0); 
        console.log( "parentControl:" +  ( newControlEle && newControlEle.tagName ));
        if ( newControlEle== null  ) {
           $( "#" + optionAreaId).css("display", "none" );
        }else {

        }
    })  ;

    this.triggleOptionRender();

}  };
