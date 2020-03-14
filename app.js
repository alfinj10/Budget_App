/************************************************************************
 * Budget MODEL  
 ************************************************************************/
var budgetController = (function(){
    var Expense = function(id,description,value){

        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;

    }

    var calculateTotalValue = function(type){

        var sum = 0;
        data.allItems[type].forEach(function(curr){
             sum += curr.value;
        });

        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
            
        },
        budget:0,
        percentage:-1
    }
    return {

        addNewInput: function(type,desc,val){
            var newItem, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else{
                ID = 0;
            }
            if(type === 'inc'){
                newItem = new Income(ID,desc,val);

            } else if(type ==='exp'){
                newItem  = new Expense(ID,desc,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function(){
            // calculate total income 
            var test2 = calculateTotalValue('inc');
            // calculate total expense
            var test = calculateTotalValue('exp');
            
            data.budget = data.totals.inc - data.totals.exp;  

            if(data.totals.inc > 0 ){

                data.percentage = Math.round((data.totals.exp/data.totals.inc)* 100);

            } else {
                data.percentage = -1;
            }
        },

        getBudget: function(){

            return{
                totalExpense: data.totals.exp,
                totalIncome: data.totals.inc,
                budget: data.budget,
                percentage: data.percentage
            };

        },

        testing: function(){
            console.log(data)
        }
    };
})();

/*************************************************************************
 * UI VIEW CONTROLLER  
 ************************************************************************/


var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        keyPress: 'keypress',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        incomeValue: '.budget__income--value',
        expenseValue:'.budget__expenses--value',
        percentageValue:'.budget__expenses--percentage',
        container: '.container clearfix'

    }
    return{
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        showItem: function(obj, type){
            var html, newHtml, element;

            if(type == "inc"){
                element = DOMstrings.incomeContainer;
                html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type == "exp"){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

           

        },
         clearFields: function(){

            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription+","+DOMstrings.inputValue);
            arrFields = Array.prototype.slice.call(fields);

            arrFields.forEach(function(current){
                current.value = ''; 

            })
            arrFields[0].focus();
        },

        displayBudget: function(obj){

            // Define DOM strings for the requried clases - DONE

            // Replace Income value 
            document.querySelector(DOMstrings.incomeValue).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expenseValue).textContent = obj.totalExpense;
            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;

            if(obj.percentage > 0){
                
                document.querySelector(DOMstrings.percentageValue).textContent = obj.percentage + '%';

            } else{
                document.querySelector(DOMstrings.percentageValue).textContent = '---';
            }

        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})(); 

/************************************************************************
 *  CONTROLLER 
 ************************************************************************/

var controller = (function (budgControl, UIControl){

    var setupEventListners = function(){

        var DOMstrings = UIControl.getDOMstrings();


        document.querySelector(DOMstrings.addBtn).addEventListener('click', addItem);
        document.addEventListener(DOMstrings.keyPress, function(event){

            if(event.keyCode === 13 || event.which === 13){        
                addItem();                
            }
        })

        document,querySelector(DOMstrings.container).addEventListener('click',);


        
    };

    var updateBudget = function(){

        budgControl.calculateBudget();
        var budget = budgControl.getBudget();
        UIControl.displayBudget(budget);
        console.log(budget);

    };

    var addItem = function(){
        var input, newItem, showInput;
        input = UIControl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

        newItem =  budgControl.addNewInput(input.type, input.description,input.value);
        UIControl.showItem(newItem,input.type);
        UIControl.clearFields();
        updateBudget();
        
        // After a new item has been added - the budge needs to be updated

        }
        
        console.log(input);
    };

    var deleteItem = function(){
    
    };

    return { 
        init: function(){
            console.log("Application has started");
            UIControl.displayBudget({
                totalExpense:0,
                totalIncome:0,
                budget:0,
                percentage:0
            })
            setupEventListners();
        }
    }

})(budgetController, UIController);

controller.init();

// NEXT STEP

// WHEN item is deleted :
// Event listener is triggered 
  //remove from the data model
  //remove the item from the ui
  //update budget
  //update percentage
  //update budget
  //