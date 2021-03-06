// from data.js
// var tableData = data;


// Identify the table and tbody
var tbody = d3.select('#ufo-tbody');

// test
// We didn't use .then() because of the version of d3 we are using, as I understand it
//d3.json("/api/recipemetadata").then((recipes) => {
   //console.log(recipes)
//});

d3.json("/api/recipemetadata", function(recipes){
    console.log(recipes)
});


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// FUNCTION buildTable()
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// Create function to generate and populate the table
function buildTable() { 

    // tbody.html('');

    d3.json("/api/recipemetadata", function(recipes){
        recipes.forEach(record => {
        var row = tbody.append('tr');
////logic: if checked -- identify the status as checked and if not set status to unchecked; add a status true or flase to records pulled from API
            // function that counts the number of recipes and then assigns an number incrementing by 1
            x = 0
            for (var i=0, len=recipes.length; i< len; i++) {
                x = x + 1
            };           

            row.append('td').append('input').attr("type", "checkbox").attr('id', `${record['recipe_id']}`).attr('class', 'recipe-checkbox');            
            row.append('td').text(record['recipe_id']);
            row.append('td').text(record['recipe_title']);
            row.append('td').append('a')
                .attr('href', record['source_url'])
                .attr('target', '_blank')
                .text(record['source_url']);
            row.append('td').text(record['likes']);
            row.append('td').text(record['health_score']);
            row.append('td').text(record['calories_serving']);
            row.append('td').text(record['carbohydrates_serving']);
            row.append('td').text(record['servings']);
            row.append('td').text(record['cooking_minutes']);
            console.log(record)

        });
    });
};


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// FUNCTION refreshTable()
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function refreshTable(data) {

    console.log('----- IN REFRESH TABLE ')
    console.log(data);

    tbody.html('');

    data.forEach(record => {
    var row = tbody.append('tr');
////logic: if checked -- identify the status as checked and if not set status to unchecked; add a status true or flase to records pulled from API
        row.append('td').append('input').attr("type", "checkbox").attr('id', `${record['recipe_id']}`).attr('class', 'recipe-checkbox');            
        row.append('td').text(record['recipe_id']);
        row.append('td').text(record['recipe_title']);
        row.append('td').text(record['source_url']);
        row.append('td').text(record['likes']);
        row.append('td').text(record['health_score']);
        row.append('td').text(record['calories_serving']);
        row.append('td').text(record['carbohydrates_serving']);
        row.append('td').text(record['servings']);
        row.append('td').text(record['cooking_minutes']);
        console.log(record)
    });
    
    // clear existing tbody
    // tbody
    // loop through the filtered data to populate the tbody

}

/// This would updated checked data (as checked/unchecked) to table when a second search is initiated, as well as, store in variable, 
///when clicking next page

function addcheckeddata(){   
    var checkeddata = [];
}


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// FUNCTION recipemetadataAPIreturn()
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function recipemetadataAPIreturn(){
    // Create a copy of tableData specifically for filtering
   
    console.log('filter table event')

    // capture value for all search fields */
    var query = d3.select('#query').property('value');
    var cuisine = d3.select('#cuisine').property('value');
    var type_of_recipe = d3.select('#type_of_recipe').property('value');
    var calories = d3.select('#calories').property('value');    
    var cookingMinutes = d3.select('#cookingMinutes').property('value');

    var filterFields

    // Build an object of fields to run through 
    var filterFields = {
        'query': query,
        'cuisine': cuisine,
        'type_of_recipe': type_of_recipe, 
        'calories': calories,
        'cookingMinutes': cookingMinutes
    }

    // Remove empty keys from the list of filters to search
    Object.entries(filterFields).forEach(([key, val]) => {
        
        // Use !val to check for empty strings or nulls
        if(!val) { 
            delete filterFields[key];
        }
    });

    console.log('----filterFields----')
    console.log(filterFields)

    // PASS query fields and values to Flask API/recipemetadata route and on to Spoonacular API
    // RETURNS query results from Spoonacular API via Flask Flask API/recipemetadata route
    // which POPULATES the returned data into our page 1 table using refreshTable() function

    d3.json(`/api/recipemetadata?query=${query}&cuisine=${cuisine}&cookingMinutes=${cookingMinutes}&calories=${calories}&type_of_recipe=${type_of_recipe}&`, function(data){
        console.log(data);
        refreshTable(data); 
    });

    // d3.json(`/api/recipemetadata?query=${query}&cuisine=${cuisine}`).then(data => {
    //     console.log(data);
    // });    
    

    // '/api/ingredients?query=pasta&cuisine=Italian&type_of_recipe=snack&calories<=400&cookingMinutes<=45'
    /*
    // Loop through each of the filter keys  
    Object.entries(filterFields).forEach(([key, value]) => {
        // Continue to refine the filteredData array 
        filterFieldsRequest.concat(`${key}=${value}&`)
    });

    str1.concat(' ', str2));
    
    filterFieldsRequest.join("")
    */

    // filterFieldsRequest = ['pasta', 'Italian', '&', '&', '&']
    // console.log(filterFieldsRequest)

    // var returns_metadata = request.args.get(filterFieldsRequest)
    // console.log('---returns_metadata---')
    // console.log(returns_metadata)
    



    // Loop through each of the filter keys and return records from filteredData that match 
    // Object.entries(filterFields).forEach(([key, value]) => {
    //     // Continue to refine the filteredData array 
    //     filteredData = filteredData.filter(row => row[key] == value);
    // });

    // console.log('----filteredData----')
    // console.log(filteredData)

    // Clear out the tbody
    

////  then add checked rows back in

    // Rebuild the filtered table using the buildTable function 
    // buildTable(filteredData);    
}


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// FUNCTION formReset()
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// Clear out input fields in the Filter Form, wipe the Table, and rebuild the Table with pristine original data
function formReset() {
    document.getElementById("filter-form").reset(); 
    tbody.html('');
    buildTable();
};


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// EVENT LISTENERS
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// Identify web elements on the page
filterbtn = d3.select('#filter-btn');
resetbtn = d3.select('#reset-btn');
checkbox = d3.select('#checkbox-btn');
queryfield = d3.select('#query')
cuisinefield = d3.select('#cuisine')
typeofrecipefield = d3.select('#type_of_recipe')
calories = d3.select('#calories')
cookingminutesfield = d3.select('#cookingMinutes')


// Add event listeners to the web elements
filterbtn.on('click', recipemetadataAPIreturn);
resetbtn.on('click', formReset);
checkbox.on('click', addcheckeddata);
queryfield.on('change', recipemetadataAPIreturn);
cuisinefield.on('change', recipemetadataAPIreturn);
typeofrecipefield.on('change', recipemetadataAPIreturn);
calories.on('change', recipemetadataAPIreturn);
cookingminutesfield.on('change', recipemetadataAPIreturn);


// Call the function to initially load the table
buildTable();


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// ASSSHIT!!!! -- ADD VALUES FROM CHECKED BOXES TO GROCERY LIST
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

console.log('foo');
d3.select("#checkbox-btn").on("click", function() {

    console.log('clicked btn');

    // recipesSelected = []
    // var boxesSelected = d3.selectAll("input.checkbox:checked");
    // boxesSelected.each(function() {
    //     console.log(this.id);
    //     recipesSelected.push(this.id);
    // });

    assshit = [];
    foo = d3.selectAll('input.recipe-checkbox:checked');
    console.log(foo);

    foo.each(function() {
        assshit.push(this.id);
    });

    console.log('this is what you will pass to the next page');
    console.log(assshit);


    recipe_ids = assshit.toString();

    // try to go another page
    window.location.href = `/page2?recipe_ids=${recipe_ids}`;
    




    // see what this is
    // ingredientsAPIreturn(assshit)

  });

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// FUNCTION ingredientsAPIreturn()
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function ingredientsAPIreturn(selectedRecipeIDs){
    // Create a copy of tableData specifically for filtering
   
    var ingredientsArray = []
    selectedRecipeIDs.forEach(recipeID => {
        d3.json(`/api/ingredients?id=${recipeID}&`, function(ingredientsReturn){
            console.log("---returned ingredients from recipe query--");
            console.log(ingredientsReturn);
            ingredientsArray.push(ingredientsReturn);
            console.log("---should return ingredientsArray---");
            console.log(ingredientsArray);
        });
    });

    // var ingredientsArray = []
    // selectedRecipeIDs.forEach(recipeID => {
    //     d3.json(`/api/ingredients?id=${recipeID}&`, function(ingredientsReturn){
    //         console.log("---returned ingredients from recipe query--");
    //         ingredientsArray.push(ingredientsReturn);
    //         console.log("---should return ingredientsArray---");
    //         console.log(ingredientsReturn);
    //     });
    // });

    // PLACEHOLDER FOR FUNCTION CALL TO MOVE THE INGREDIENT QUERY API CALL RETURNS TO 2ND HTML PAGE
    
 };




 /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// FUNCTION buildGroceriesTable()
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////



// Create function to generate and populate the table
function buildGroceriesTable() { 

    // Identify the table and tbody
    var tbody2 = d3.select('#grocery-tbody');


    const urlParams = new URLSearchParams(window.location.search);
    const recipe_ids = urlParams.get('recipe_ids');
    console.log(`page 2:  ${recipe_ids}`);

    // INGREDIENTS DATA API CALL
    d3.json(`/api/getIngredientList?recipe_ids=${recipe_ids}`, function(groceries) {
        console.log(' --- Ingredient data from /api/ingredients --- ')
        console.log(groceries);

        groceries.forEach(record => {
            console.log('this is going in the table');
            console.log(record);
            var row = tbody2.append('tr');
        ////logic: if checked -- identify the status as checked and if not set status to unchecked; add a status true or flase to records pulled from API
                // function that counts the number of recipes and then assigns an number incrementing by 1
                
                row.append('td').text(record['recipe_id']);
                row.append('td').text(record['recipe_title']);
                row.append('td').text(record['ingredient']);
                row.append('td').text(record['price']);
                row.append('td').text(record['ingredient_title']);
                row.append('td').text(record['size']);            
                console.log(record);
    
            });
    });
}

    // // ####### need to identify tbody
    // tbody.html('');

    // groceryTestData = [
    //     {
    //     recipe_id: 1438341,
    //     recipe_title: "Quick & Easy Mexican Pizzas",
    //     ingredient: "beef",
    //     price: 3.0,
    //     ingredient_title: "Quick & Easy Mexican Pizzas",
    //     size: 4.4
    //     },
    //     {
    //     recipe_id: 1438341,
    //     recipe_title: "Quick & Easy Mexican Pizzas",
    //     ingredient: "pizza",
    //     price: 30.0,
    //     ingredient_title: "Quick & Easy Mexican Pizzas",
    //     size: 7.4
    //     }
    // ];
        

    // d3.json("/api/grocerylist", function(groceries){        

    // });



    
//     groceryTestData.forEach(record => {
//         var row = tbody2.append('tr');
// ////logic: if checked -- identify the status as checked and if not set status to unchecked; add a status true or flase to records pulled from API
//             // function that counts the number of recipes and then assigns an number incrementing by 1
            
//         row.append('td').text(record['recipe_id']);
//         row.append('td').text(record['recipe_title']);
//         row.append('td').text(record['ingredient']);
//         row.append('td').text(record['price']);
//         row.append('td').text(record['ingredient_title']);
//         row.append('td').text(record['size']);            
//         console.log(record);

//     });
    
//};



//buildGroceriesTable();