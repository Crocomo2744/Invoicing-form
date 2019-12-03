function fetchPDF(invoice_id, data) {
  const req = new XMLHttpRequest();
  req.open("POST", "https://invoice-as-a-service.cleverapps.io/api/invoice/generate", true);
  req.responseType = "arraybuffer";
  req.setRequestHeader("Content-Type", "application/json");
  req.upload.onloadstart = function(){
  $(".send_invoice").hide();
  $("#loader").show()
}


  req.onload = function (e) {
    if (req.status == 201) {
      const blob = new Blob([req.response], {
        type: "application/pdf",
      });
      const fileURL = URL.createObjectURL(blob);
      console.log(fileURL);

      // download file
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = "invoice-" + invoice_id + ".pdf";
      link.click();

      $("#items_table").find('input[name="record"]').each(function(){
        $(this).parents("tr").remove();
      });
      $("#subtotal_result").html(0+" €");
      $("#taxes_result").html(0+" €");
      $("#final_total_result").html(0+" €");

    } else if (req.status == 422) {
      const buff = String.fromCharCode.apply(null, new Uint8Array(req.response));
      const errors = JSON.parse(buff);
      displayErrors(errors);
    } else {
      alert("Unexpected error");
    }
  };
  req.send(JSON.stringify(data));
  req.onreadystatechange = function (){
    $("#loader").hide();
    $(".send_invoice").show();
  } 
}

function displayErrors(errors) {
  var objectTitle = Object.keys(errors);
console.log(errors)
  for(var i =0; i<objectTitle.length; i++){
    var changes = objectTitle[i]
    var objectContent = errors[changes].toString();
    changes = changes.replace(".","");
    
    if(objectContent.indexOf("required") != -1 ){
      $("#"+changes).find("span").first().hide()
      $("#"+changes).find(".span2").show()
    }
   else if(objectContent.indexOf("valid email") != -1 ){
    $("#"+changes).find("span").first().hide()
    $("#"+changes).find(".span2").show()
    }
  } 
}
function add (){
  var names = $("#names").val();
  var description = $("#description").val();
  var quantity = $("#quantity").val();
  var unitPrice  = $("#unit_price").val();
  var tax = $("#tax").val();
  var total = quantity * unitPrice;
  var tax_income= (tax/100)*total;
  tax_income = tax_income.toFixed(2);
  if(names != "" & unitPrice != "" & tax != "" & names.length>2 & description.length>2){
    var test = "<tr><td><input type='checkbox' name='record'></td><td>"  + names+ "</td><td>" + description +"</td><td>" + quantity + "</td><td>" + unitPrice + "</td><td>" + tax  + "</td><td>" + total +"</td><td>" + tax_income + "</td></tr>";    $("#items_table").append(test);

  
    $("#newitems")[0].reset();
    $("#items_table").find('tr').each(function(){
      var rowCount = $('#items_table >tbody >tr').length;
      var subtotal=0;
      var taxes = 0;
      var final_total = 0; 
      for (var a = 1 ; a<rowCount; a++){
      subtotal+= Math.round(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[a].cells[6].innerHTML);
      taxes += parseFloat(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[a].cells[7].innerHTML);
      final_total = subtotal+taxes;
      }
      document.getElementById("subtotal_result").innerHTML = subtotal+" €";
      document.getElementById("taxes_result").innerHTML = taxes+" €";
      document.getElementById("final_total_result").innerHTML = final_total+" €";
      $("#items").find("span").html("").css({"border": "none"})
    });
  }
  else{
   $("#items").find("span").html("Names, Description, Unit price and % of tax are compulsory <br> Names and Description field must be at least 3 characters").css({"color": "red", "border": "2px solid red"})
  } 
}


$(document).ready(function() {
  
  $("#subtotal_result").html(0+" €");
  $("#taxes_result").html(0+" €");
  $("#final_total_result").html(0+" €");

   
  $(".send_invoice").click(function(){
    var invoice_number = $('input[name="invoice_number"]').val();
    var  current_date_recup= $('input[name="current_date"]').val();
    var current_date = (new Date(current_date_recup).getTime())/1000;
    current_date = parseInt(current_date);
    var due_date_recup = $('input[name="due_date"]').val();
    var due_date = (new Date(due_date_recup).getTime()/1000);
    due_date= parseInt(due_date);
    var customer_name = $('input[name="customer_name"]').val();
    
    var customer_email = $('input[name="customer_email"]').val();
    var customer_tel = $('input[name="customer_tel"]').val();
    
    var customer_address = $('input[name="customer_address"]').val();
    var customer_postcode = $('input[name="customer_postcode"]').val();
    var customer_city = $('input[name="customer_city"]').val();
    var customer_country = $('input[name="customer_country"]').val();
    
    var proper_name = $('input[name="proper_name"]').val();
    var proper_email = $('input[name="proper_email"]').val();
    var proper_tel = $('input[name="proper_tel"]').val();
    var proper_address = $('input[name="proper_address"]').val();
    var proper_postcode = $('input[name="proper_postcode"]').val();
    var proper_city = $('input[name="proper_city"]').val();
    var proper_country = $('input[name="proper_country"]').val();


    var rowCount = $('#items_table >tbody >tr').length; 
    var items = [];
    var item = {};
    
    for (var i = 1 ; i<rowCount; i++){
        var name_test = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].cells[1].innerHTML;
        var description_test = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].cells[2].innerHTML;          
        var quantity_test = parseFloat(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].cells[3].innerHTML) ;
        var unit_price_test = parseFloat(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].cells[4].innerHTML) ;
        var tax_test= parseFloat(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[i].cells[5].innerHTML) ;
        item = {
          "title" : name_test,
          "description" : description_test,
          "price" : unit_price_test,
          "quantity" : quantity_test,
          "tax" : tax_test
        }
        items.push(item)
      }

    var data = {
      "id": invoice_number,
      "currency": "€",
      "lang": "en",
      "date": current_date,
      "due_date": due_date,
      "payment_link": "https://amazon.com/user/invoices/42/pay",
      "decimals": 2,
      "notes": "Lorem ipsum dolor sit amet.",

      "items": items
      ,

      "customer": {
          "summary" : customer_name,
          "address_line_1" : customer_address,
          "address_line_2" : customer_postcode,
          "address_line_3" : customer_city,
          "address_line_4" : customer_country,
          "phone" : customer_tel,
          "email" : customer_email
      },

      "company": {
          "summary" : proper_name,
          "address_line_1" : proper_address,
          "address_line_2" : proper_postcode,
          "address_line_3" : proper_city,
          "address_line_4" : proper_country,
          "phone" : proper_tel,
          "email" : proper_email
      },
 }
 $(".span1").show()
 $(".span2").hide();

 var businnessData = {
  "summary" : proper_name,
  "address_line_1" : proper_address,
  "address_line_2" : proper_postcode,
  "address_line_3" : proper_city,
  "address_line_4" : proper_country,
  "phone" : proper_tel,
  "email" : proper_email
 }

 function stockBusiness (){
localStorage.setItem("businessInfo", JSON.stringify(businnessData))
 }

stockBusiness();

 fetchPDF(invoice_number, data);
});
  


$(document).keypress (function(event){2
  var names = $("#names").val();
  var description = $("#description").val();
  var unitPrice  = $("#unit_price").val();
  var tax = $("#tax").val();
  
  if(names!= "" & description!= "" & unitPrice!= "" & tax!= ""){
    if(event.which == 13){
      add();
    }
  }
  
})
$("#webStorage").click(function(){

  if(typeof localStorage!='undefined'){
    var businnessData = JSON.parse(localStorage.getItem("businessInfo"));
    $('input[name="proper_name"]').val(businnessData.summary)
    $('input[name="proper_email"]').val(businnessData.email);
    $('input[name="proper_tel"]').val(businnessData.phone);
    $('input[name="proper_address"]').val(businnessData.address_line_1);
    $('input[name="proper_postcode"]').val(businnessData.address_line_2);
    $('input[name="proper_city"]').val(businnessData.address_line_3);
    $('input[name="proper_country"]').val(businnessData.address_line_4);
  }
  else{
    alert("You don't have any information saved yet")
  }
 
})

    $("#add-row").click(function (){
      add();
    });


   $(".delete-row").click(function(){
     $("#items_table").find('input[name="record"]').each(function(){

       if($(this).is(":checked")){

           $(this).parents("tr").remove();
         }
     });
     $("#items_table").find('tr').each(function(){
       var rowCount = $('#items_table >tbody >tr').length;
       var subtotal=0;
       var taxes = 0;
       var final_total = 0; 
       for (var a = 1 ; a<rowCount; a++){
       subtotal+= Math.round(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[a].cells[6].innerHTML);

       taxes += parseFloat(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[a].cells[7].innerHTML);
       final_total = subtotal+taxes;
       }
       document.getElementById("subtotal_result").innerHTML = subtotal+" €";
       document.getElementById("taxes_result").innerHTML = taxes+" €";
       document.getElementById("final_total_result").innerHTML = final_total+" €";
     });

   });

   $("#reset-row").click(function(){
     $("#items_table").find('input[name="record"]').each(function(){
           $(this).parents("tr").remove();
         
     });
     var subtotal=0;
     var taxes = 0;
     var final_total = 0; 
   
     document.getElementById("subtotal_result").innerHTML = subtotal+" €";
     document.getElementById("taxes_result").innerHTML = taxes+" €";
     document.getElementById("final_total_result").innerHTML = final_total+" €";
   });

   var date = new Date();

   var day = date.getDate();
   var month = date.getMonth() + 1;
   var year = date.getFullYear();

   if (month < 10) month = "0" + month;
   if (day < 10) day = "0" + day;

   var today = year + "-" + month + "-" + day;       
   $(".theDate").attr("value", today);


});

