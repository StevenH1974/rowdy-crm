// ========== LOAD DASHBOARD ==========
async function loadDashboard() {

    // Fetch all orders from Supabase
    const { data: orders, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

    if (error) {
        console.error('Error loading dashboard:', JSON.stringify(error));
        return;
    }

    // Total Orders
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = orders.length;

    // Revenue This Month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const monthlyOrders = orders.filter(order => {
    const [year, month] = order.order_date.split('-');
    return parseInt(month) - 1 === thisMonth && parseInt(year) === thisYear;
});
    const revenue = monthlyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = '$' + revenue.toFixed(2);

    // Fetch inventory alerts
    const { data: inventory } = await supabaseClient
        .from('inventory')
        .select('*');
    const alerts = inventory.filter(item => getStockStatus(item.quantity) === 'low' || getStockStatus(item.quantity) === 'out');
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = alerts.length;

    // New Customers This Month
    const newCustomers = monthlyOrders.length;
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = newCustomers;

    // Recent Orders Table
    const recentOrders = orders.slice(0, 5);
    const tbody = document.querySelector('.recent-orders tbody');
    tbody.innerHTML = '';
    recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.product}</td>
            <td>$${order.total}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ========== FORMAT DATE ==========
function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
}

// ========== LOAD ORDERS FROM SUPABASE ==========
async function loadOrders() {
    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

    if (error) {
        console.error('Error loading orders:', error);
        return;
    }

    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';

    data.forEach(order => {
        const row = document.createElement('tr');
        row.dataset.status = order.status;
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.product}</td>
            <td>$${order.total}</td>
            <td>${formatDate(order.order_date)}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ========== GET STOCK STATUS ==========
function getStockStatus(quantity) {
    if (quantity === 0) {
        return 'out';
    } else if (quantity <= 9) {
        return 'low';
    } else {
        return 'ok';
    }
}

// ========== LOAD INVENTORY FROM SUPABASE ==========
async function loadInventory() {
    const { data, error } = await supabaseClient
        .from('inventory')
        .select('*')
        .order('flavor', { ascending: true });

    if (error) {
        console.error('Error loading inventory:', JSON.stringify(error));
        return;
    }

    const tbody = document.querySelector('#inventory .orders-table tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Popcorn</td>
            <td>${item.flavor}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
         <td><span class="status-badge ${getStockStatus(item.quantity)}">${getStockStatus(item.quantity).toUpperCase()}</span></td>
        `;
        tbody.appendChild(row);
    });
}

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
        loadDashboard();
    } else {
        // Show the selected section
        document.getElementById(sectionId).style.display = 'block';

        // Load live data depending on section
        if (sectionId === 'orders') {
            loadOrders();
        } else if (sectionId === 'inventory') {
            loadInventory();
        } else if (sectionId === 'finances') {
            showFinances('daily');
        }
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

// ========== FINANCES ==========
async function showFinances(period) {
    // Update active button
    document.querySelectorAll('#finances .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Fetch all orders from Supabase
    const { data: orders, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

    if (error) {
        console.error('Error loading finances:', JSON.stringify(error));
        return;
    }

    const now = new Date();
    let filtered = [];

    if (period === 'daily') {
        filtered = orders.filter(order => {
            const [year, month, day] = order.order_date.split('-');
            return parseInt(day) === now.getDate() &&
                   parseInt(month) - 1 === now.getMonth() &&
                   parseInt(year) === now.getFullYear();
        });
    } else if (period === 'weekly') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        filtered = orders.filter(order => {
            const orderDate = new Date(order.order_date);
            return orderDate >= weekAgo;
        });
    } else if (period === 'monthly') {
        filtered = orders.filter(order => {
            const [year, month] = order.order_date.split('-');
            return parseInt(month) - 1 === now.getMonth() &&
                   parseInt(year) === now.getFullYear();
        });
    } else if (period === 'annual') {
        filtered = orders.filter(order => {
            const [year] = order.order_date.split('-');
            return parseInt(year) === now.getFullYear();
        });
    } else if (period === 'ytd') {
        filtered = orders.filter(order => {
            const [year] = order.order_date.split('-');
            return parseInt(year) === now.getFullYear();
        });
    }

    // Calculate summary stats
    const revenue = filtered.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const orderCount = filtered.length;
    const avg = orderCount > 0 ? revenue / orderCount : 0;

    document.getElementById('finance-revenue').textContent = '$' + revenue.toFixed(2);
    document.getElementById('finance-orders').textContent = orderCount;
    document.getElementById('finance-avg').textContent = '$' + avg.toFixed(2);

    // Build table
    const tbody = document.getElementById('finance-tbody');
    tbody.innerHTML = '';

    filtered.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(order.order_date)}</td>
            <td>#${order.id}</td>
            <td>$${parseFloat(order.total).toFixed(2)}</td>
            <td>${order.customer_name}</td>
        `;
        tbody.appendChild(row);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No orders found for this period.</td></tr>';
    }
}

// ========== FILTER CUSTOMERS ==========
function filterCustomers(segment) {
    // Update active button
    document.querySelectorAll('#customers .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const rows = document.querySelectorAll('#customers-tbody tr');
    const now = new Date();

    rows.forEach(row => {
        const lastOrderCell = row.cells[5].textContent;
        const totalSpentCell = parseFloat(row.cells[4].textContent.replace('$', ''));
        const totalOrdersCell = parseInt(row.cells[3].textContent);

        // Convert last order date to days ago
        const [month, day, year] = lastOrderCell.split('/');
        const lastOrderDate = new Date(`${year}-${month}-${day}`);
        const daysAgo = Math.floor((now - lastOrderDate) / (1000 * 60 * 60 * 24));

        let show = false;

        if (segment === 'all') {
            show = true;
        } else if (segment === 'active') {
            show = daysAgo <= 30;
        } else if (segment === 'lapsed') {
            show = daysAgo > 30 && daysAgo <= 90;
        } else if (segment === 'inactive') {
            show = daysAgo > 90;
        } else if (segment === 'high-value') {
            show = totalSpentCell >= 20;
        } else if (segment === 'first-time') {
            show = totalOrdersCell === 1;
        }

        row.style.display = show ? '' : 'none';
    });
}

// ========== EXPORT CUSTOMERS ==========
function exportCustomers() {
    const rows = document.querySelectorAll('#customers-tbody tr');
    let csv = 'Name,Email,Phone,Total Orders,Total Spent,Last Order,Status\n';

    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const cells = row.cells;
            const status = cells[6].querySelector('span').textContent;
            csv += `${cells[0].textContent},${cells[1].textContent},${cells[2].textContent},${cells[3].textContent},${cells[4].textContent},${cells[5].textContent},${status}\n`;
        }
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rowdy-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// ========== INITIALIZE ==========
loadDashboard();