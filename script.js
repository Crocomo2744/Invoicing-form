var validRequest = false;

function totalcalculation (){
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
      validRequest = true;
      

      $("#items_table").find("button").each(function(){
        $(this).parents("tr").remove();
      });
      var currency = $("#currency").val();
      $("#subtotal_result").html(0+" "+ currency);
      $("#taxes_result").html(0+" "+ currency);
      $("#final_total_result").html(0+" " + currency);

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
    var test = "<tr><td><td>"  + names+ "</td><td>" + description +"</td><td>" + quantity + "</td><td>" + unitPrice + "</td><td>" + tax  + "</td><td>" + total +"</td><td>" + tax_income + "</td><td>" +"<button type='button' class='delete-row'>Delete row</button>" +"</td></tr>";
    $("#items_table").append(test);
    $("#newitems")[0].reset();
    totalcalculation ();
    $(".span3").hide();
  }
  else{
   $(".span3").show();
  } 
}


$(document).ready(function() {

  var countButton = 0;
  var currency = $("#currency").val();
  $("#subtotal_result").html(0+" "+ currency);
  $("#taxes_result").html(0+" "+ currency);
  $("#final_total_result").html(0+" " + currency);
  
  $("#currency").change(function(){
    currency = $("#currency").val();
    $("#subtotal_result").html(0+" "+ currency);
    $("#taxes_result").html(0+" "+ currency);
    $("#final_total_result").html(0+" " + currency);
  });
  
  
  var howmanybuttons = JSON.parse(localStorage.getItem("numberButtons"));
for(var z=0; z<howmanybuttons; z++){
  var storedButton = JSON.parse(localStorage.getItem("button"+z));
  $("#history_menu").find("ul").append(storedButton);
}
$("#history_menu").find('.historyClass').each(function(){
  countButton ++
  
});


  $(".send_invoice").click(function(){
    var invoice_number = $('input[name="invoice_number"]').val();
    var  current_date_recup= $('input[name="current_date"]').val();
    console.log(current_date_recup)
    console.log(typeof current_date_recup);
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
      "currency": currency,
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
 var pricetotal = document.getElementById("final_total_result").innerHTML;
 fetchPDF(invoice_number, data);
 
 function stockData (){
  if(validRequest== true){
   localStorage.setItem(invoice_number, JSON.stringify(data))


   var saveButton = "<li><a href='#' id="+invoice_number+" class='historyClass' >Invoice_"+invoice_number+" : "+customer_name+" : "+ pricetotal + "</a></li>";
   $("#history_menu").find("ul").append(saveButton);
   var setItemnames= "button"+countButton;
   localStorage.setItem(setItemnames,JSON.stringify(saveButton));
   countButton++
   localStorage.setItem("numberButtons",JSON.stringify(countButton));  

  }
 }
 setTimeout(stockData, 5000); 
});

$(document).keypress (function(event){
  var names = $("#names").val();
  var description = $("#description").val();
  var unitPrice  = $("#unit_price").val();
  var tax = $("#tax").val();
  
  if(names!= "" & description!= "" & unitPrice!= "" & tax!= ""){
    if(event.which == 13){
      add();
    }
  }
});


  $("#add-row").click(function (){
    add();

  });



  $("#items_table").on('click', '.delete-row', function(){
    $(this).parents("tr").remove();
    totalcalculation ();
  });

   $("#reset-row").click(function(){
     $("#items_table").find("button").each(function(){
           $(this).parents("tr").remove();
     });
     var subtotal=0;
     var taxes = 0;
     var final_total = 0; 
   
     document.getElementById("subtotal_result").innerHTML = subtotal+" "+ currency;
     document.getElementById("taxes_result").innerHTML = taxes+" "+ currency;
     document.getElementById("final_total_result").innerHTML = final_total+" "+ currency;
   });

   $("#history_menu").on('click', '.historyClass', function(){
    $("#items_table").find("button").each(function(){
      $(this).parents("tr").remove();
    });
    var storedID = $(this).attr("id");
   if(typeof localStorage!='undefined'){
    $("#items_table").find('').each(function(){
      $(this).parents("tr").remove();
    });
     var storedData = JSON.parse(localStorage.getItem(storedID));
    //invoice data
    $('input[name="invoice_number"]').val(storedData.id);
    var storedDue_Date = new Date (storedData.due_date *1000);
    storedDue_Date = storedDue_Date.toISOString()
    storedDue_Date = storedDue_Date.slice(0, 10)
    var storedCurrent_Date = new Date (storedData.date*1000);
    storedCurrent_Date = storedCurrent_Date.toISOString()
    storedCurrent_Date = storedCurrent_Date.slice(0, 10)
    
    $('input[name="current_date"]').val(storedCurrent_Date);
    $('input[name="due_date"]').val(storedDue_Date);
    $("#currency").val(storedData.currency)

    // customer data
    $('input[name="customer_name"]').val(storedData.customer.summary)
    $('input[name="customer_email"]').val(storedData.customer.email);
    $('input[name="customer_tel"]').val(storedData.customer.phone);
    $('input[name="customer_address"]').val(storedData.customer.address_line_1);
    $('input[name="customer_postcode"]').val(storedData.customer.address_line_2);
    $('input[name="customer_city"]').val(storedData.customer.address_line_3);
    $('input[name="customer_country"]').val(storedData.customer.address_line_4);
    
     //company data
     $('input[name="proper_name"]').val(storedData.company.summary)
     $('input[name="proper_email"]').val(storedData.company.email);
     $('input[name="proper_tel"]').val(storedData.company.phone);
     $('input[name="proper_address"]').val(storedData.company.address_line_1);
     $('input[name="proper_postcode"]').val(storedData.company.address_line_2);
     $('input[name="proper_city"]').val(storedData.company.address_line_3);
     $('input[name="proper_country"]').val(storedData.company.address_line_4);

     //items
     var nbtable = storedData.items.length ;
    for(var o=0; o<nbtable; o++){
      var tablenames = storedData.items[o].title;
      var tabledescription = storedData.items[o].description;
      var tablequantity = storedData.items[o].quantity;
      var tableunitPrice  = storedData.items[o].price;
      var tabletax = storedData.items[o].tax;
      var tabletotal = tablequantity * tableunitPrice;
      var tabletax_income= (tabletax/100)*tabletotal;
      tabletax_income = tabletax_income.toFixed(2);
      var tabletest = "<tr><td><td>"  + tablenames+ "</td><td>" + tabledescription +"</td><td>" + tablequantity + "</td><td>" + tableunitPrice + "</td><td>" + tabletax  + "</td><td>" + tabletotal +"</td><td>" + tabletax_income + "</td><td>" +"<button type='button' class='delete-row'>Delete row</button>" +"</td></tr>"; 
      $("#items_table").append(tabletest);
    }
    totalcalculation ()
   }
   else{
     alert("You don't have any information saved yet")
   }
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
