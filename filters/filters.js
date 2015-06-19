 /** 
    rainbow chart
**/
window.Samples = window.Samples || {};

Samples.Filters = (function(){

    /** ------------------------------------ setup filters
    */
    var setupFilters = function() {

        var hasFilters = $("#filters");

        var existingFilters = Samples.DATA.selected; // shorthand for passed in filters
        var existingFiltersCount = existingFilters.length;

        var options = Samples.DATA.options; // shorthand for all filtering options
        var optionsCount = options.length; // how many options

        var created = 0;    // this counts how many filters currently exist
        var createKey = 0;  // this counts how many filters have ever been created 1 page session and is the ref key
        var prevFilterKey = null; // previous created row reference

        var filterRowRef = {}; // reference filter rows created and their components
        var filterRowOrd = []; // maps to the order the filters appear on the page
        var myFilters = [];
        var filterLookup = {};

        var existingGroups = {};
        var existTopic = {};

        // put all the options in each topic group into a dictionary called filterLookup
        // the value is the topic group index, the key is the filter name

        for (var z = 0; z < options.length; z++) {
            var selectOptions = options[z].options;
            for (var opt in selectOptions) {
                filterLookup[opt] = options[z].index;
            }
        }

        // for the existing filters passed in from previously, see if it is a valid filter for our options
        // put it into an array

        for (var g = 0; g < existingFilters.length; g++){
            var seekFilter = existingFilters[g];
            var seekGroup = filterLookup[seekFilter];

            // ok this is a valid filter
            if (seekGroup) {
                myFilters.push([ seekFilter, seekGroup ]); // only add if we actually have this filter
            } else {
                // this filter is not in our filter options list, remove it
                existingFiltersCount--;
                existingFilters.splice(g, 1);
            }
        }

        // is the filters we received a part of our select options
        // we will need to look through all the options...
        var buildFilterURL = function(baseURL){
            var filterURL = baseURL + "?filter=";
            var first = true; // first does not have +

            // iterate through our filter rows looking for selected values

            for (var createID in filterRowRef) {
                var selectList = filterRowRef[createID].selectList; // look at all the option selects
                var choosenSelect;
                for (var x = 0; x < selectList.length; x++){
                    if (!$(selectList[x]).hasClass("noshow")) {
                        choosenSelect = $(selectList[x]);
                        break; // found the choosen option in this row
                    }
                }

                var filterVal = $(choosenSelect).val();
                // make sure this filter actually has a value
                if (filterVal && (filterVal.length > 1)){
                    if (!first) { filterURL += "+"; } // not the first thing so add +
                    filterURL += filterVal;
                    first = false;
                }
                    
            };

            console.log("filter ", filterURL);
            return filterURL;
        }

         // ------------------------ submit this set of filters

        var applyFilters = function(e){
            if (e) { e.preventDefault(); }
            var currentURL = window.location.href.split('?')[0];
            var filterURL = buildFilterURL(currentURL);
            document.location = filterURL;
        };

        // ------------------------ the select option has changed
        var filterChanged = function(){
            if ($(this).val()) { applyFilters(); }
        };

        // ------------------------ topic changed
        var topicChanged = function(){   
            var rowNum = $(this).data("id");
            var selectedTopic = $(this).val();

            if (selectedTopic == "") {
                selectedTopic = "none";
            }
            var selects = filterRowRef[rowNum].selectList;
            for (var k = 0; k < selects.length; k++){
                if ($(selects[k]).hasClass(selectedTopic)){
                    $(selects[k]).removeClass("noshow");
                } else {
                    $(selects[k]).addClass("noshow");
                }
            }
        };

        // ------------------------ add filter clicked

        var addFilter = function(e){
            if (e) { e.preventDefault(); }
            if ($(this).hasClass("grayout")) { return; } // do nothing if disabled
            createFilter();
        };

        // ------------------------ remove filter clicked

        var removeFilter = function(e){
            if (e) { e.preventDefault(); }
            
            if ($(this).hasClass("grayout")) { return; } // do nothing if disabled

            var target = $(this).data("id"); // which row to remove
            var resetRow = filterRowRef[target];
            var resetHadVal = $(resetRow.select).val(); // save the value of the row we are removing

            // find position of current guy so we can get at the guy after
            var rowOrdIndex = filterRowOrd.length; // assume last in array is the removing guy
            for (var x = 0; x < filterRowOrd.length; x++){
                if (filterRowOrd[x] == target){
                    rowOrdIndex = x;
                    break;
                }
            }

            var prevKey = filterRowRef[target].prev; // what is the key of the previous filter
            var prevFilter = filterRowRef[prevKey]; // the actual filter before this one

            prevFilterKey = prevKey; // update it globally

            // is there a next filter? if so update its prev pointer 
            var nextFilterKey = filterRowOrd[rowOrdIndex+1];
            if (nextFilterKey) {
                var nextFilter = filterRowRef[nextFilterKey]; // the filter after this one
                nextFilter.prev = prevKey;
            }
        
            // update nextfilter to previous filter
            filterRowOrd.splice(rowOrdIndex, 1); // remove from filters order as well
            delete filterRowRef[target]; // remove data about this row
            $(resetRow.row).remove();  // remove this row from the dom
            
            created--;

            // if there was a previously selected filter refresh the page
            if (resetHadVal){
                applyFilters();
            } else {
                if (prevFilter) {
                    $(prevFilter.add).removeClass("grayout"); // let us add new filter again
                    $(prevFilter.join).addClass("noshow"); 

                    // only 1 row left dont let it be removed
                    if (created == 1) {
                        $(prevFilter.remove).addClass("grayout")
                    }
                }
            }
        };

        
        // ------------------------ create a filter

        var createFilter = function(){

            var newRow = $('<div/>', { 'class': 'filter-row', 'data-id': createKey });
            var joinText = $('<div/>', { 'text' : 'AND', 'class' : 'join-label noshow'});
            var addBtn = $('<a/>', { 'class' : 'ss-add add-filter', 'data-id': createKey, 'href' : '#' }).click(addFilter);
            var removeBtn = $('<a/>', { 'class' : 'ss-subtract remove-filter', 'data-id': createKey, 'href' : '#' }).click(removeFilter);
            var firstOption, selectedSelect;
            var newSelectList = []; // the options available for each group of topics

            // make the topic select box and add the default nothing value
            var topicSelect = $('<select/>', { 'class' : 'filter-select-topic', 'data-id': createKey });
            $(topicSelect).append($('<option/>', { 'text' : '---', 'value' : '' })); 
            $(topicSelect).on("change", topicChanged);

            // add the empty select box for when there is no topic selected
            var allSelect = $('<select/>', { 'class' : 'filter-select none' , 'data-id': createKey, 'disabled' : true });
            $(allSelect).append($('<option/>', { 'text' : '---', 'value' : '' }));
            selectedSelect = allSelect; // default to select none
            newSelectList.push(allSelect); // add it to the array of selects we display in the 2nd col

            // now add the options for the topic group
            for (var j=0; j < options.length; j++) {
                var topic = options[j];

                // if this topic has not already been selected
                if (!existTopic[topic.index]) {

                    var newTopicOption = $('<option/>', { 'value' : topic.index, 'text': topic.label });

                    // this topic has already been created previously
                    if (myFilters[created] && topic.index == myFilters[created][1]) {
                        $(newTopicOption).prop("selected", true);
                        existTopic[topic.index] = true;
                    }

                    $(topicSelect).append(newTopicOption);

                    // for every topic that exists, create a select box
                    var newSelect = $('<select/>', { 'class' : 'filter-select noshow ' + topic.index, 'data-id': createKey });
                    var selectedOne = false; 

                    $(newSelect).append($('<option/>', { 'text' : '---', 'value' : '' }));
                    $(newSelect).on("change", filterChanged); // observe filter changing

                    for (var key in topic.options) {
                        var newOption = $('<option/>', { 'value' : key, 'text': topic.options[key] });

                        if (key == existingFilters[created]) {
                            $(newOption).prop("selected", true);
                            existingGroups[topic.label] = true; // add this to selected
                            selectedOne = true;
                        }

                        $(newSelect).append(newOption);
                    }

                    if (selectedOne){
                        $(newSelect).removeClass("noshow"); // this one is showing
                        $(allSelect).addClass("noshow"); // something is selected hide placeholder
                        selectedSelect = newSelect;
                    }

                    newSelectList.push(newSelect);
                }
            }

            // add buttons and join text
            $(newRow).append(addBtn);
            $(newRow).append(removeBtn);

            if (created == 0 ){
                $(removeBtn).addClass("grayout");
            }

            if (created == Samples.DATA.MAX-1){
                $(addBtn).addClass("grayout"); // add no more at filte limit
            }

            // do we have a previous filter? if so show join lable and disable add
            prevFilter = filterRowRef[prevFilterKey];
            if (prevFilter){
                $(prevFilter.join).removeClass("noshow");
                $(prevFilter.add).addClass("grayout"); // something already added

                // once there is more than 1 row, the first row is remove-able
                if (created >= 1) {
                    $(prevFilter.remove).removeClass("grayout");
                }
            } 
                
            $(newRow).append(topicSelect);

            // add all the possible select options for the list of topics in this row
            for (var u = 0; u < newSelectList.length; u++){
                $(newRow).append(newSelectList[u]);
            }

            // if not the last row add join text
            if (created < Samples.DATA.MAX-1) {
                $(newRow).append(joinText);
            } 

            $(hasFilters).append(newRow);

            // create refrences to created elements and save them
            var ref = {
                "key" : createKey,
                "row" : newRow,
                "topicSelect" : topicSelect,
                "selectList" : newSelectList,
                "select" : selectedSelect,
                "add" : addBtn,
                "remove" : removeBtn,
                "join" : joinText,
                "prev" : prevFilterKey
            };

            filterRowRef[createKey] = ref; // remember this created row
            filterRowOrd.push(createKey); // we add this to the ordering

            prevFilterKey = createKey; // save this key for next filter
            created++;
            createKey++;
        };

        // ------------------------ on load 

        if ( existingFiltersCount == 0) {
            createFilter(); // no pre-existing filters
        } else {
            for ( var k = 0; k < existingFiltersCount; k++ ) {
                createFilter(); // create passed in filters
            }
        }
    };



    // ----------------- public

    PublicMethods = {
        init : function(){
            setupFilters();
        }
    };

    return PublicMethods;

}());

// on doc ready
$(function () {
    Samples.Filters.init();
});


    