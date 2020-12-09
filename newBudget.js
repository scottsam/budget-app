let budgetPart = (function () {
  //defining our function constructors for incomes and expenses
  function Expense(id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  }
  function Income(id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  }

  function calcTotal(type) {
    let sum = 0;
    data.all[type].forEach((cur) => {
      sum += cur.amount;
    });
    data.total[type] = sum;
  }

  const data = {
    all: {
      income: [],
      expense: [],
    },
    total: {
      income: 0,
      expense: 0,
    },
    budget: 0,
  };

  return {
    calcBudget: function () {
      calcTotal("income");
      calcTotal("expense");

      data.budget = data.total.income - data.total.expense;
    },
    budgetUpdate: function () {
      return {
        budgety: data.budget,
        incomeTotal: data.total.income,
        expenseTotal: data.total.expense,
      };
    },

    addItem: function (type, des, amt) {
      let newItem, id;
      if (data.all[type].length > 0) {
        id = data.all[type][data.all[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      if (type === "income") {
        newItem = new Income(id, des, amt);
      } else if (type === "expense") {
        newItem = new Expense(id, des, amt);
      }

      data.all[type].push(newItem);
      return newItem;
    },

    dataTest: function () {
      console.log(data);
    },
    itemDelete: function (type, id) {
      let ids, index;
      ids = data.all[type].map((cur) => {
        return cur.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.all[type].splice(index, 1);
      }
    },
  };
})();

let UIpart = (function () {
  //putting all the selector strings in an object
  const selectors = {
    enterBtn: ".enter",
    itemDescrp: ".item_input",
    itemValue: ".item_value",
    itemType: ".type",
    itemName: ".item_name",
    itemAmount: ".item_amount",
    incomeList: ".income_list",
    expenseList: ".expense_list",
    budgetString: ".budget_value",
    incomeString: ".income_value",
    expenseString: ".expense_value",
    container: ".exp_inc_list",
    yearString: ".month",
  };

  return {
    getInputs: function () {
      return {
        type: document.querySelector(selectors.itemType).value,
        description: document.querySelector(selectors.itemDescrp).value,
        amount: parseInt(document.querySelector(selectors.itemValue).value),
      };
    },
    displayBudget: function (obj) {
      const budget = document.querySelector(selectors.budgetString);
      const income = document.querySelector(selectors.incomeString);
      const expense = document.querySelector(selectors.expenseString);

      budget.textContent = `${obj.budgety}`;
      income.textContent = `${obj.incomeTotal}`;
      expense.textContent = `${obj.expenseTotal}`;
    },
    getSelectors: function () {
      return selectors;
    },
    deleteList: function (selectedID) {
      let del = document.getElementById(selectedID);
      del.parentNode.removeChild(del);
    },
    displayMonth: function () {
      let month, year, now, months;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      months = [
        "January",
        "Febuary",
        " March",
        "April",
        "May",
        "June",
        "July",
        " August",
        "September",
        "October",
        "November",
        "December",
      ];
      const yearly = document.querySelector(selectors.yearString);
      yearly.textContent = `${months[month]} ${year}`;
    },

    addInputsUI: function (obj, type) {
      let html, element;
      if (type === "income") {
        html = `<div class="item" id="income-${obj.id}">
                <div class="item_name">${obj.description}</div>
                <div class="item_amount">${obj.amount}</div>
                <div class="item_delete">
                    <button class="btn_del">x</button>
                </div>
            </div>`;
        element = document.querySelector(selectors.incomeList);
      } else if (type === "expense") {
        html = ` <div class="item" id="expense-${obj.id}">
                <div class="item_name">${obj.description}</div>
                <div class="item_amount">${obj.amount}</div>
                <div class="item_delete">
                    <button class="btn_del">x</button>
                </div>
            </div>`;
        element = document.querySelector(selectors.expenseList);
      }
      element.insertAdjacentHTML("beforeend", html);
    },
  };
})();

let controlPart = (function (budgetPrt, uiPrt) {
  let DOM = uiPrt.getSelectors();

  function eventListener() {
    document
      .querySelector(DOM.enterBtn)
      .addEventListener("click", function (event) {
        event.preventDefault();
        crtl();

        document
          .querySelector(DOM.container)
          .addEventListener("click", function (event) {
            deleteItem(event);
          });
      });
  }

  function updateBudget() {
    budgetPrt.calcBudget();
    const bud = budgetPrt.budgetUpdate();
    uiPrt.displayBudget(bud);
  }

  function crtl() {
    let inputs = uiPrt.getInputs();

    if (
      (inputs.description !== "") &
      !this.isNaN(inputs.amount) &
      (inputs.value !== 0)
    ) {
      let newItem = budgetPrt.addItem(
        inputs.type,
        inputs.description,
        inputs.amount
      );

      uiPrt.addInputsUI(newItem, inputs.type);

      document.querySelector(DOM.itemValue).value = "";
      document.querySelector(DOM.itemDescrp).value = "";
      document.querySelector(DOM.itemDescrp).focus();

      updateBudget();
    }
  }

  function deleteItem(event) {
    let itemId, splitId, type, ID;
    itemId = event.target.parentNode.parentNode.id;
    splitId = itemId.split("-");

    type = splitId[0];
    ID = parseInt(splitId[1]);
    budgetPrt.itemDelete(type, ID);

    uiPrt.deleteList(itemId);

    updateBudget();
  }

  return {
    init: function () {
      uiPrt.displayMonth();
      eventListener();
    },
  };
})(budgetPart, UIpart);

controlPart.init();
