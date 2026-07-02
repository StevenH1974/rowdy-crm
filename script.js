// ========== SECTION NAVIGATION ==========
function showSection(sectionId) {
    
    // Hide the dashboard stats and recent orders
    document.querySelector('.stats-row').style.display = 'none';
    document.querySelector('.recent-orders').style.display = 'none';

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Remove active class from all nav links
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.classList.remove('active');
    });

    // If dashboard is clicked show stats and recent orders
    if (sectionId === 'dashboard') {
        document.querySelector('.stats-row').style.display = 'flex';
        document.querySelector('.recent-orders').style.display = 'block';
    } else {
        // Show the selected section
        document.getElementById(sectionId).style.display = 'block';
    }

    // Set the active nav link
    event.target.classList.add('active');

    // Update the top bar title
    document.querySelector('.top-bar h2').textContent = sectionId.toUpperCase();
}

// ========== ORDER FILTERING ==========
function filterOrders(status) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show or hide rows based on status
    document.querySelectorAll('#orders-tbody tr').forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            if (row.dataset.status === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// ========== MARGIN CALCULATOR ==========
function calculateMargin() {
    const cost = parseFloat(document.getElementById('cost-input').value);
    const price = parseFloat(document.getElementById('price-input').value);
    const resultBox = document.getElementById('margin-result');

    if (isNaN(cost) || isNaN(price)) {
        resultBox.textContent = 'Please enter valid numbers for both fields.';
        return;
    }

    if (price === 0) {
        resultBox.textContent = 'Selling price cannot be zero.';
        return;
    }

    const profit = price - cost;
    const margin = ((profit / price) * 100).toFixed(2);

    resultBox.textContent = `Profit: $${profit.toFixed(2)} | Margin: ${margin}%`;
}

// ========== REPORT SELECTOR ==========
function showReport(type) {
    // Update active button
    document.querySelectorAll('.report-selector .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update report table header based on report type
    const thead = document.getElementById('report-thead');
    const tbody = document.getElementById('report-tbody');

    if (type === 'sales') {
        thead.innerHTML = `<tr>
            <th>Date</th>
            <th>Orders</th>
            <th>Revenue</th>
            <th>Top Product</th>
        </tr>`;
        tbody.innerHTML = `
            <tr><td>07/01/2026</td><td>2</td><td>$23.98</td><td>Classic Butter - Large</td></tr>
            <tr><td>06/30/2026</td><td>1</td><td>$24.99</td><td>Bundle Pack x2</td></tr>`;
    } else if (type === 'orders') {
        thead.innerHTML = `<tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
        </tr>`;
        tbody.innerHTML = `
            <tr><td>#1001</td><td>Jane Smith</td><td>$12.99</td><td>New</td></tr>
            <tr><td>#1002</td><td>Mike Johnson</td><td>$10.99</td><td>Processing</td></tr>
            <tr><td>#1003</td><td>Sarah Lee</td><td>$24.99</td><td>Shipped</td></tr>`;
    } else if (type === 'inventory') {
        thead.innerHTML = `<tr>
            <th>Flavor</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Status</th>
        </tr>`;
        tbody.innerHTML = `
            <tr><td>Broccoli Cheddar</td><td>Medium</td><td>50</td><td>OK</td></tr>
            <tr><td>Bloody Mary</td><td>Medium</td><td>8</td><td>Low</td></tr>
            <tr><td>Ballpark Condiments</td><td>Medium</td><td>0</td><td>Out</td></tr>
            <tr><td>Chili Lime Margarita</td><td>Medium</td><td>32</td><td>OK</td></tr>
            <tr><td>Sweet & Spicy BBQ</td><td>Medium</td><td>5</td><td>Low</td></tr>`;
    } else if (type === 'revenue') {
        thead.innerHTML = `<tr>
            <th>Month</th>
            <th>Revenue</th>
            <th>Orders</th>
            <th>vs Last Month</th>
        </tr>`;
        tbody.innerHTML = `
            <tr><td>July 2026</td><td>$0.00</td><td>0</td><td>--</td></tr>
            <tr><td>June 2026</td><td>$0.00</td><td>0</td><td>--</td></tr>`;
    } else if (type === 'customers') {
        thead.innerHTML = `<tr>
            <th>Month</th>
            <th>New Customers</th>
            <th>Returning Customers</th>
            <th>Total Orders</th>
        </tr>`;
        tbody.innerHTML = `
            <tr><td>July 2026</td><td>0</td><td>0</td><td>0</td></tr>
            <tr><td>June 2026</td><td>0</td><td>0</td><td>0</td></tr>`;
    } else if (type === 'shipping') {
        thead.innerHTML = `<tr>
            <th>Date</th>
            <th>Orders Shipped</th>
            <th>Total Shipping Cost</th>
            <th>Average Per Order</th>
        </tr>`;
        tbody.innerHTML = `
            <tr><td>07/01/2026</td><td>0</td><td>$0.00</td><td>$0.00</td></tr>
            <tr><td>06/30/2026</td><td>0</td><td>$0.00</td><td>$0.00</td></tr>`;
    }
}