$(document).ready(function() {
    var origin_id = 0;
    var destination_id = 0;
    $("#origin-input").keyup(function() {
        $('#origin-list').html('');
        let origin = $("#origin-input").val();
        if (origin.length < 3) {
            return;
        }
        //console.log(origin);
        $.ajax({
            url: "https://api.exline.systems/public/v1/regions/origin?title=" + origin,
            dataType: 'json',
            success: function(result){
                //console.log(result);
                $.each(result, function(key, value) {
                    $.each(value, function(k,v) {
                        //console.log(v);
                        $('#origin-list').append('<option data-id="'+ v.id +'" value="' + v.title + ' | ' + v.cached_path + '">');
                    })
                })
                // $('option').on('click', function() {
                //     origin_id = $("#origin-list option[value='" + $('#origin-input').val() + "']").attr('data-id');
                //     console.log(origin_id);
                // })
                $('#origin-input').change(function(){
                    origin_id = $("#origin-list option[value='" + $('#origin-input').val() + "']").attr('data-id');
                });
                console.log(origin_id);
            }
        })
    })
    $("#destination-input").keyup(function() {
        $('#destination-list').html('');
        let destination = $("#destination-input").val();
        if (destination.length < 3) {
            return;
        }
        //console.log(origin);
        $.ajax({
            url: "https://api.exline.systems/public/v1/regions/destination?title=" + destination,
            dataType: 'json',
            success: function(result){
                //console.log(result);
                $.each(result, function(key, value) {
                    $.each(value, function(k,v) {
                        //console.log(v);
                        $('#destination-list').append('<option data-id="'+ v.id +'" value="' + v.title + ' | ' + v.cached_path + '">');
                    })
                })
                $('#destination-input').change(function(){
                    destination_id = $("#destination-list option[value='" + $('#destination-input').val() + "']").attr('data-id');
                    console.log(destination_id);
                });
            }
        })
    })
    $("button").on("click", function() {
        let endpoint = 'https://api.exline.systems/public/v1/calculate';
        let service =  $('#service-select').val();
        let weight = $('#weight-input').val();
        let fee = $("#fee-input").val()/100;
        console.log(weight);
        if (service=="" || fee=="" || weight=="" || origin_id==0 || destination_id==0) {
            alert("Заполните все поля");
            return;
        }
        let pattern = /^\d+\.?\d*$/;
        if (!pattern.test(weight)) {
            alert("Вес должен быть цифрой");
            return;
        }
        $.ajax({
            url: endpoint + "?origin_id=" + origin_id + "&destination_id=" + destination_id + "&weight=" + weight + "&service=" + service,
            dataType: 'json',
            success: function(result){
                // console.log(result);
                $("#price").html(result.calculation.price);
                $("#fuel").html(result.calculation.fuel_surplus);
                $("#fee").html(fee);
                let total = result.calculation.price + result.calculation.fuel_surplus + fee;
                $("#total-price").html(total);
            }
        });
    })
});
