$(document).ready(function() {
  
    


  $("#subtotal_result").html(0+" €");
  $("#taxes_result").html(0+" €");
  $("#final_total_result").html(0+" €");

   
   $(".send_invoice").click(function(){
     var invoice_number = $('input[name="invoice_number"]').val();
     var  current_date_recup= $('input[name="current_date"]').val();
     var current_date = (new Date(current_date_recup).getTime())/1000;
     var due_date_recup = $('input[name="due_date"]').val();
     var due_date = (new Date(due_date_recup).getTime()/1000);
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
     var d ={};

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
       "id": "42",
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
           "adsress_line_4" : customer_country,
           "phone" : customer_tel,
           "email" : customer_email
       },

       "company": {
           "summary" : proper_name,
           "address_line_1" : proper_address,
           "address_line_2" : proper_postcode,
           "address_line_3" : proper_city,
           "adsress_line_4" : proper_country,
           "phone" : proper_tel,
           "email" : proper_email
        },
        
        "s3": {
          "presigned_url": null
      },

      "ftp": {
        "host": "127.0.0.1",
        "username": "ftpuser",
        "password": "superSecretPassword",
        "path" : "C:\wamp64\www"
      }

  }
            
       
  
     $("#subtotal_result").html(0+" €");
     $("#taxes_result").html(0+" €");
     $("#final_total_result").html(0+" €");


     var ajaxRequest  = $.ajax({
       type: "POST",
       url: 'https://invoice-as-a-service.cleverapps.io/api/invoice/generate',
        data: data,
       dataType: "json",
               
       success: function(result)
         {alert("well done");
       
         },

         error: function(jqXHR, textStatus, errorThrown) {
           alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');

           $('#result').html('<p>status code: '+jqXHR.status+'</p><p>errorThrown: ' + errorThrown + '</p>');
          
       } 
     });
     $.when(ajaxRequest).done(function (ajaxValue) {
       var win = window.open('', '_blank');
       win.location.href = ajaxValue;
       console.log(ajaxValue);
 });
 });

   


   $("#add-row").click(function(){
     var names = $("#names").val();
     var description = $("#description").val();
     var quantity = $("#quantity").val();
     var unitPrice  = $("#unit_price").val();
     var tax = $("#tax").val();
     var total = quantity * unitPrice;
     var tax_income= (tax/100)*total;
     tax_income.toFixed(2);

     if(names != "" & unitPrice != "" & tax != ""){
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
       });
     }
     else{
       alert("Names, Unit price and % of tax are compulsory")
     }
    
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

