$(".send_invoice").click(function(){
  var invoice_number = $('input[name="invoice_number"]').val();
  var current_date = $('input[name="current_date"]').val()
  var due_date = $('input[name="due_date"]').val();
  var customer_name = $('input[name="customer_name"]').val();
  var customer_email = $('input[name="customer_email"]').val()
  var customer_tel = $('input[name="customer_tel"]').val();
  var customer_adress = $('input[name="customer_adress"]').val();
  var customer_postcode = $('input[name="customer_postcode"]').val()
  var customer_city = $('input[name="customer_city"]').val();
  var customer_country = $('input[name="customer_country"]').val();
})

var ajaxRequest = $.ajax({
type: "POST",
url: '',// je ne sais pas trop quelle url mettre 
data: $(".form-invoice").serialize(),
dataType: "json",
        
success: function(result)
  {
    $.each(result,function(index, value)
    { 
    alert(index+' : '+value);
    })

  }
});
$.when(ajaxRequest).done(function (ajaxValue) {
var win = window.open('', '_blank');
win.location.href = ajaxValue;
});


$(document).ready(function() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day;       
  $(".theDate").attr("value", today);
});


$(document).ready(function(){
  $(".add-row").click(function(){
    var items = $("#items").val();
    var names = $("#names").val();
    var description = $("#description").val();
    var quantity = $("#quantity").val();
    var unitPrice  = $("#unit_price").val();
    var tax = $("#tax").val();
    var total = $("#total").val();
    var test = "<tr><td><input type='checkbox' name='record'></td><td>" + items + "</td><td>" + names+ "</td><td>" + description +"</td><td>" + quantity + "</td><td>" + unitPrice + "</td><td>" + tax + "</td><td>" + total + "</td></tr>";
    $("table").append(test);
    $("#newitems")[0].reset();
    
  });

  $(".delete-row").click(function(){
    $("table").find('input[name="record"]').each(function(){

      if($(this).is(":checked")){

          $(this).parents("tr").remove();
        }
    });
  });




    $(".testinvoice").click(function invoice_information(){
      this.invoice_number = $('input[name="invoice_number"]').val();
      this.current_date = $('input[name="current_date"]').val()
      this.due_date = $('input[name="due_date"]').val();
    });

    $(".testinvoice").click(function customer(name, email, tel, adress, postcode, city, country ){
      this.name = $('input[name="customer_name"]').val();
      this.email = $('input[name="customer_email"]').val()
      this.tel = $('input[name="customer_tel"]').val();
      this.adress = $('input[name="customer_adress"]').val();
      this.postcode = $('input[name="customer_postcode"]').val()
      this.city = $('input[name="customer_city"]').val();
      this.country = $('input[name="customer_city"]').val();
    });

    $(".testinvoice").click(function customer(name, email, tel, adress, postcode, city, country ){
      this.name = $('input[name="proper_name"]').val();
      this.email = $('input[name="proper_email"]').val()
      this.tel = $('input[name="proper_tel"]').val();
      this.adress = $('input[name="proper_adress"]').val();
      this.postcode = $('input[name="proper_postcode"]').val()
      this.city = $('input[name="proper_city"]').val();
      this.country = $('input[name="proper_country"]').val();
    });

    
});
