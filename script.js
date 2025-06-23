let budget = 0;
let totalSpent = 0;
const categoryTotals = { Food: 0, Transport: 0, Entertainment: 0 };

function setBudget() {
  const budgetInput = document.getElementById("budget").value;
  budget = Number(budgetInput);
  totalSpent = 0;
  document.getElementById("balance").textContent = `Balance: KES ${budget - totalSpent}`;
  document.getElementById("expense-list").innerHTML = ""; // clear old entries
}

// Update this part inside your expense form submit handler:
document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  totalSpent += amount;

  const listItem = document.createElement("li");
  listItem.textContent = `${description} - ${category} - KES ${amount}`;
  document.getElementById("expense-list").appendChild(listItem);

  const balance = budget - totalSpent;
  document.getElementById("balance").textContent = `Balance: KES ${balance}`;

  this.reset();

  // Alert if balance is low
  if (balance < 1000) {
    alert("⚠️ Warning: Your balance is getting low!");
  }
});

categoryTotals[category] += amount;
updateChart();

let chart;

function updateChart() {
  const ctx = document.getElementById("categoryChart").getContext("2d");
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) {
    chart.data.datasets[0].data = data;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          label: "Spending by Category",
          data: data,
          backgroundColor: ["#f39c12", "#3498db", "#e74c3c"]
        }]
      }
    });
  }
}
function downloadStatement() {
  let content = `Monthly Budget: KES ${budget}\nTotal Spent: KES ${totalSpent}\nRemaining Balance: KES ${budget - totalSpent}\n\nExpenses:\n`;

  const items = document.querySelectorAll("#expense-list li");
  items.forEach((item, index) => {
    content += `${index + 1}. ${item.textContent}\n`;
  });

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Expense_Statement.txt";
  link.click();
}
function clearAll() {
  totalSpent = 0;
  budget = 0;
  for (let key in categoryTotals) {
    categoryTotals[key] = 0;
  }
  document.getElementById("expense-list").innerHTML = "";
  document.getElementById("balance").textContent = "Balance: KES 0";
  document.getElementById("budget").value = "";
  if (chart) {
    chart.destroy();
    chart = null;
  }
}