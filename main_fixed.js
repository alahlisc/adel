
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.section');

    menuLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.style.display = section.id === target ? 'block' : 'none';
            });
        });
    });

    fetch('jason.json')
        .then(response => response.json())
        .then(data => {
            displayExpenses(data);
            displaySummary(data);
            displayReport(data);
        });

    function displayExpenses(data) {
        const container = document.getElementById('expenses-table');
        let html = '<table><tr><th>التاريخ</th><th>البند</th><th>المستلم</th><th>القيمة</th></tr>';
        data.forEach(item => {
            html += `<tr>
                        <td>${item.date}</td>
                        <td>${item.item}</td>
                        <td>${item.receiver}</td>
                        <td>${item.amount}</td>
                     </tr>`;
        });
        html += '</table>';
        container.innerHTML = html;
    }

    function displaySummary(data) {
        const container = document.getElementById('summary');
        let total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        container.innerHTML = `<p>إجمالي المصاريف: ${total.toFixed(2)} دينار</p>`;
    }

    function displayReport(data) {
        const container = document.getElementById('report-content');
        const byItem = {};
        data.forEach(item => {
            if (!byItem[item.item]) byItem[item.item] = 0;
            byItem[item.item] += parseFloat(item.amount);
        });

        let html = '<h3>تقرير حسب البنود</h3><ul>';
        for (const item in byItem) {
            html += `<li>${item}: ${byItem[item].toFixed(2)} دينار</li>`;
        }
        html += '</ul>';
        container.innerHTML = html;
    }
});
