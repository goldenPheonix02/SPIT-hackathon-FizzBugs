const user = Qs.parse(location.search, {
    ignoreQueryString: true
});

const username = user['?college']
console.log(username);

var c_data;
$(document).ready(function() {

    // FETCHING DATA FROM JSON FILE
    $.getJSON("data.json",
        function(data) {
            var about = '';
            var loc = '';
            var dom = '';
            var exam = '';
            var nrank = '';
            var crank = '';
            var fee = '';
            var plc = '';
            var ctc = '';
            var clg = '';

            // ITERATING THROUGH OBJECTS
            $.each(data, function(key, value) {
                console.log("got data");
                infoclg = Object.values(value);
                //CONSTRUCTION OF ROWS HAVING
                // DATA FROM JSON OBJECT
                console.log(infoclg[0]);
                if (infoclg[0] == username) {
                    console.log("Hit");

                    clg += infoclg[0];
                    loc += infoclg[1];
                    dom += infoclg[4];
                    exam += infoclg[5];
                    nrank += infoclg[6];
                    crank += infoclg[2];
                    fee += infoclg[3];
                    plc += infoclg[7];
                    ctc += infoclg[8];
                    about += infoclg[9];


                    $('#clgname').append(clg);
                    $('#clgintro').append(about);
                    var child = document.createElement("a")
                    child.href = loc
                    child.innerText = "Map"
                    $('#loc').append(child);
                    $('#dom').append(dom);
                    $('#exam').append(exam);
                    $('#rnk').append(nrank);
                    $('#crnk').append(crank);
                    $('#fees').append(fee);
                    $('#plmt').append(plc);
                    $('#ctc').append(ctc);


                    return false;
                }

            });
        });
});