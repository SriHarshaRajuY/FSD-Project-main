document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        home: document.getElementById('homeSection'),
        knowledgeBase: document.getElementById('knowledgeBaseSection'),
        ticket: document.getElementById('ticketSection'),
        article: document.getElementById('articleSection'),
        articleList: document.getElementById('articleListSection')
    };

    const navLinks = {
        home: document.getElementById('homeLink'),
        support: document.getElementById('supportLink'),
        knowledgeBase: document.getElementById('knowledgeBaseLink'),
        ticket: document.getElementById('submitTicketLink')
    };

    const articles = {
        'buy-now-pay-later': {
            title: 'What is "Buy Now Pay Later" Payment Mode',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:50 AM',
            content: `
                <p>1. Pay Later is one of the payment modes of the Simpl payment gateway, in which you can checkout with 1 tap and pays later.</p>
                <p>2. All your purchases (done by Simpl-Pay Later on any website) get added to one convenient bill, which you can pay in one go, after every 15 days.</p>
                <p>3. Also, you can choose to pay for your transactions even before your bill is generated, with the help of UPI, Credit, or Debit Cards.</p>
                <p>You can do so by logging into your account via Simpl App or Website (<a href="https://getsimpl.com/signin">https://getsimpl.com/signin</a>).</p>
                <p>*By using the Simpl payment gateway (any mode), you will get 30% or Rs. 70 OFF (whichever is the minimum) on your order.</p>
            `
        },
        'cancel-refund': {
            title: 'Cancel/Replace/Refund/Return',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:31 PM',
            content: `
                <p>Once the order has been confirmed, it cannot be canceled, refunded, replaced, or returned.</p>
                <p>*We do not have a refund policy if you refuse the delivery.</p>
                <p>Please refer to the <a href="#">Refund Policy</a> for more details.</p>
            `
        },
        'order-status': {
            title: 'Order Status',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:13 PM',
            content: `
                <p>You can check the status of your order by logging into your account and navigating to the "Orders" section.</p>
                <p>If you have any issues, please contact our support team.</p>
            `
        },
        'damage-product': {
            title: 'Damage/Wrong Product Received',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:33 PM',
            content: `
                <p>If you received a damaged or wrong product, please contact our support team within 48 hours of delivery.</p>
                <p>Provide your order details and a photo of the product for faster processing.</p>
            `
        },
        'cashback': {
            title: 'Cashback Voucher/Cashback Coupon',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:38 PM',
            content: `
                <p>Cashback vouchers and coupons can be redeemed during checkout.</p>
                <p>Ensure the coupon is valid and meets the minimum order value requirements.</p>
            `
        },
        'what-is-simpl': {
            title: 'What is Simpl',
            modifiedDate: 'Sat, 20 May, 2023 at 3:17 PM',
            content: `
                <p>Simpl is a payment gateway that offers convenient payment solutions for online shopping.</p>
                <p>It allows users to make purchases instantly and pay later within a specified timeframe.</p>
                <p>Key features include one-tap checkout and consolidated billing every 15 days.</p>
                <p>Learn more at <a href="https://getsimpl.com">https://getsimpl.com</a>.</p>
            `
        },
        'pay-later-cod': {
            title: 'Is Pay Later and COD are same?',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:49 AM',
            content: `
                <p>No, Pay Later and Cash on Delivery (COD) are different payment methods.</p>
                <p>Pay Later (via Simpl) allows you to complete purchase instantly and pay after 15 days.</p>
                <p>COD requires payment in cash at the time of delivery.</p>
                <p>Pay Later offers more flexibility without immediate payment, unlike COD.</p>
            `
        },
        'update-address': {
            title: 'How to Update Address?',
            modifiedDate: 'Thu, 9 Feb, 2023 at 11:27 AM',
            content: `
                <p>To update your address:</p>
                <p>1. Log in to your NurseryLive account.</p>
                <p>2. Go to "My Account" > "Address Book".</p>
                <p>3. Click "Edit" next to the address you want to update.</p>
                <p>4. Enter new details and save changes.</p>
                <p>Note: Address cannot be changed once an order is placed.</p>
            `
        },
        'unable-login': {
            title: 'Unable to Login',
            modifiedDate: 'Thu, 9 Feb, 2023 at 11:28 AM',
            content: `
                <p>If you can't log in:</p>
                <p>1. Verify your email/phone and password are correct.</p>
                <p>2. Use "Forgot Password" to reset if needed.</p>
                <p>3. Clear browser cache or try a different browser.</p>
                <p>4. Contact support if the issue persists.</p>
            `
        },
        'redeem-cash': {
            title: 'How to redeem Our n-cash',
            modifiedDate: 'Thu, 9 Feb, 2023 at 11:28 AM',
            content: `
                <p>To redeem n-cash:</p>
                <p>1. Add items to your cart.</p>
                <p>2. Proceed to checkout.</p>
                <p>3. In the payment section, select "Apply n-cash".</p>
                <p>4. Enter the amount you wish to redeem and confirm.</p>
                <p>*n-cash cannot be combined with certain offers.</p>
            `
        },
        'bulk-order': {
            title: 'Bulk Order',
            modifiedDate: 'Thu, 9 Feb, 2023 at 11:28 AM',
            content: `
                <p>For bulk orders:</p>
                <p>1. Contact our support team with your requirements.</p>
                <p>2. Provide details like quantity, products, and delivery location.</p>
                <p>3. We'll offer a custom quote and timeline.</p>
                <p>Special discounts may apply for bulk purchases.</p>
            `
        },
        'cash-delivery': {
            title: 'Cash on Delivery',
            modifiedDate: 'Thu, 9 Feb, 2023 at 11:29 AM',
            content: `
                <p>Cash on Delivery (COD) allows payment at delivery time.</p>
                <p>1. Select COD at checkout.</p>
                <p>2. Have exact cash ready for the delivery person.</p>
                <p>3. COD availability depends on your pin code.</p>
                <p>*Additional COD charges may apply.</p>
            `
        },
        'simpl-advantages': {
            title: 'Advantages of using Simpl!? or Will I receive any discount for using Simpl!?',
            modifiedDate: 'Sat, 20 May, 2023 at 3:33 PM',
            content: `
                <p>Advantages of Simpl:</p>
                <p>1. Instant checkout with one tap.</p>
                <p>2. Pay all purchases together every 15 days.</p>
                <p>3. Get 30% or Rs. 70 OFF (whichever is lower) on NurseryLive orders.</p>
                <p>4. No hidden fees or interest for timely payments.</p>
            `
        }
    };

    const articleLists = {
        'quick-help': {
            title: 'Quick Help',
            articles: [
                { id: 'order-status', title: 'Order Status', modifiedDate: 'Fri, 10 Jun, 2022 at 4:13 PM' },
                { id: 'cancel-refund', title: 'Cancel/Replace/Refund/Return', modifiedDate: 'Fri, 10 Jun, 2022 at 4:31 PM' },
                { id: 'damage-product', title: 'Damage/Wrong Product Received', modifiedDate: 'Fri, 10 Jun, 2022 at 4:33 PM' },
                { id: 'cashback', title: 'Cashback Voucher/Cashback Coupon', modifiedDate: 'Fri, 10 Jun, 2022 at 4:38 PM' },
                { id: 'update-address', title: 'How to Update Address?', modifiedDate: 'Thu, 9 Feb, 2023 at 11:27 AM' },
                { id: 'unable-login', title: 'Unable to Login', modifiedDate: 'Thu, 9 Feb, 2023 at 11:28 AM' },
                { id: 'redeem-cash', title: 'How to redeem Our n-cash', modifiedDate: 'Thu, 9 Feb, 2023 at 11:28 AM' },
                { id: 'bulk-order', title: 'Bulk Order', modifiedDate: 'Thu, 9 Feb, 2023 at 11:28 AM' },
                { id: 'cash-delivery', title: 'Cash on Delivery', modifiedDate: 'Thu, 9 Feb, 2023 at 11:29 AM' }
            ]
        },
        'payment-gateway': {
            title: 'Simpl Payment Gateway',
            articles: [
                { id: 'what-is-simpl', title: 'What is Simpl', modifiedDate: 'Sat, 20 May, 2023 at 3:17 PM' },
                { id: 'buy-now-pay-later', title: 'What is "Buy Now Pay Later" Payment Mode', modifiedDate: 'Fri, 2 Jun, 2023 at 9:50 AM' },
                { id: 'pay-later-cod', title: 'Is Pay Later and COD are same?', modifiedDate: 'Fri, 2 Jun, 2023 at 9:49 AM' },
                { id: 'simpl-advantages', title: 'Advantages of using Simpl!? or Will I receive any discount for using Simpl!?', modifiedDate: 'Sat, 20 May, 2023 at 3:33 PM' }
            ]
        }
    };

    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.classList.remove('active'));
        sections[sectionName].classList.add('active');

        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        if (navLinks[sectionName]) navLinks[sectionName].classList.add('active');
    }

    function showArticle(articleId) {
        const article = articles[articleId];
        if (!article) return;

        const articleContent = sections.article;
        articleContent.querySelector('.breadcrumb').innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="support">Support</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge base</a> > 
            ${article.title}
        `;
        articleContent.querySelector('.article-content').innerHTML = `
            <h1>${article.title}</h1>
            <p class="modified-date">Modified on ${article.modifiedDate}</p>
            ${article.content}
        `;
        showSection('article');
    }

    function showArticleList(listId) {
        const list = articleLists[listId];
        if (!list) return;

        const articleListSection = sections.articleList;
        articleListSection.querySelector('.breadcrumb').innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="support">Support</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge base</a> > 
            ${list.title}
        `;
        const articlesHtml = list.articles.map(article => `
            <li>
                <a href="#" data-article="${article.id}">${article.title}</a>
                <div class="modified-date">Modified on ${article.modifiedDate}</div>
            </li>
        `).join('');
        articleListSection.querySelector('.article-list').innerHTML = `
            <h1>${list.title}</h1>
            <ul>${articlesHtml}</ul>
        `;
        showSection('articleList');
    }

    navLinks.home.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/';
    });

    navLinks.support.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });

    navLinks.knowledgeBase.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('knowledgeBase');
    });

    navLinks.ticket.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('ticket');
    });

    document.getElementById('browseArticlesCard').addEventListener('click', () => {
        showSection('knowledgeBase');
    });

    document.getElementById('submitTicketCard').addEventListener('click', () => {
        showSection('ticket');
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-article]')) {
            e.preventDefault();
            showArticle(e.target.dataset.article);
        }
        if (e.target.matches('[data-list]')) {
            e.preventDefault();
            showArticleList(e.target.dataset.list);
        }
        if (e.target.matches('[data-section]')) {
            e.preventDefault();
            showSection(e.target.dataset.section);
        }
    });

    const ticketForm = document.getElementById('ticketForm');
    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            requester: document.getElementById('requester').value,
            subject: document.getElementById('subject').value,
            type: document.getElementById('type').value,
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch('/submit-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                ticketForm.reset();
                showSection('home');
            } else {
                alert(result.message || 'Error submitting ticket');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('.feedback-btn')) {
            e.preventDefault();
            const feedback = e.target.dataset.value;
            console.log('Feedback:', feedback);
            alert('Thank you for your feedback!');
        }
    });
});