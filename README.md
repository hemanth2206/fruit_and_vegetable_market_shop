# Cart and Order Management System - Implementation Guide

## Features Implemented

### 1. **Add to Cart Button on Products Page**
- Location: [client/src/components/common/Products.jsx](client/src/components/common/Products.jsx)
- Functionality:
  - Each product card displays an "Add to Cart" button
  - Button changes color to green and shows "✓ Added" for 2 seconds after clicking
  - Adds product to buyer's cart with quantity 1
  - Requires buyer to be logged in

### 2. **Shopping Cart Component**
- Location: [client/src/components/buyer/Cart.jsx](client/src/components/buyer/Cart.jsx)
- Features:
  - Display all items in cart with product name, price, and quantity
  - **Adjust Quantity**: Use +/- buttons or type quantity directly
  - **Remove Items**: Remove individual products from cart
  - **Cart Summary**: Shows subtotal and total amount
  - **Place Order Button**: Submit order to backend

### 3. **Place Order Functionality**
- When buyer clicks "Place Order":
  - Items are grouped by vendor (multiple orders created if from different vendors)
  - Each order gets a unique Order ID
  - Order status starts as "pending"
  - Buyer details are captured (name, email)
  - Cart is automatically cleared after successful order placement

### 4. **Vendor Orders Component**
- Location: [client/src/components/vendor/Orders.jsx](client/src/components/vendor/Orders.jsx)
- Features:
  - View all orders received for vendor's products
  - **Filter by Status**: pending, confirmed, shipped, delivered, cancelled
  - **Order Details**:
    - Buyer name and email
    - Products ordered with quantity and price
    - Total amount
    - Order date
  - **Update Order Status**: Mark order as confirmed, shipped, delivered, or cancel

## Backend Models & APIs

### Order Model
- Location: [server/models/orderModel.js](server/models/orderModel.js)
- Fields:
  - `orderId`: Unique order identifier
  - `buyer`: Reference to buyer
  - `buyerEmail` & `buyerName`: Buyer details
  - `vendor`: Reference to vendor
  - `vendorEmail`: Vendor email
  - `items[]`: Array of ordered products
  - `totalAmount`: Total order value
  - `orderStatus`: pending/confirmed/shipped/delivered/cancelled
  - `createdAt`, `updatedAt`: Timestamps

### Buyer API Endpoints

#### 1. Add to Cart
```
POST /buyer-api/cart/:buyerId/add
Body: { productId, qty }
```

#### 2. Get Cart
```
GET /buyer-api/cart/:buyerId
Response: { message, payload: cart }
```

#### 3. Update Item Quantity
```
PUT /buyer-api/cart/:buyerId/item/:productId
Body: { qty }
```

#### 4. Remove Item from Cart
```
DELETE /buyer-api/cart/:buyerId/item/:productId
```

#### 5. Clear Cart
```
POST /buyer-api/cart/:buyerId/clear
```

#### 6. **Place Order** (NEW)
```
POST /buyer-api/place-order/:buyerId
Body: { cartItems }
Response: { message, payload: [orders] }

Process:
1. Validates cart is not empty
2. Groups items by vendor
3. Creates separate order for each vendor
4. Captures buyer and vendor information
5. Clears buyer's cart on success
```

### Vendor API Endpoints

#### 1. Get All Vendor Orders
```
GET /vendor-api/orders/:vendorId
Response: { message, payload: [orders] }
Note: Returns orders sorted by creation date (newest first)
```

#### 2. Get Single Order Details
```
GET /vendor-api/order/:orderId
Response: { message, payload: order }
```

#### 3. Update Order Status
```
PUT /vendor-api/orders/:orderId
Body: { orderStatus }
Valid statuses: pending, confirmed, shipped, delivered, cancelled
Response: { message, payload: updatedOrder }
```

## User Flow

### Buyer Journey
1. Browse products on home page
2. Click "Add to Cart" button on desired products
3. Navigate to Cart component
4. Review items and adjust quantities if needed
5. Click "Place Order"
6. Order confirmation and cart clears
7. Can view order history

### Vendor Journey
1. Login as vendor
2. View "Orders" component
3. See all pending orders with buyer details
4. Update order status through workflow:
   - pending → confirmed → shipped → delivered
5. Can cancel orders if needed

## Technical Implementation Details

### Frontend
- Uses React Context for user state management
- Axios for API calls
- Bootstrap for UI styling
- State management for cart items and order status

### Backend
- Express.js with async/await handlers
- MongoDB for data persistence
- Middleware for vendor/buyer verification
- Error handling and validation

### Order Creation Logic
```javascript
1. Receives cart items from buyer
2. Fetches product details from database
3. Extracts vendor information from products
4. Groups items by vendor email
5. For each vendor:
   - Creates new Order document
   - Links buyer and vendor IDs
   - Sets initial status to "pending"
6. Clears buyer's cart
7. Returns array of created orders
```

## Key Features

✅ **Multi-vendor Support**: One order per vendor if buying from multiple vendors
✅ **Order Tracking**: Vendors can update order status in real-time
✅ **Cart Management**: Full CRUD operations on cart items
✅ **Buyer Details**: Automatically captured from Clerk authentication
✅ **Order History**: Vendors see all orders with filtering
✅ **Status Workflow**: Structured order status progression
✅ **Error Handling**: Comprehensive error messages and validation

## Testing Checklist

- [ ] Add product to cart as buyer
- [ ] Update cart item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Place order with items from single vendor
- [ ] Place order with items from multiple vendors
- [ ] View orders as vendor
- [ ] Filter orders by status
- [ ] Update order status through workflow
- [ ] Cancel an order
- [ ] Verify cart clears after order placement

## Notes

- Cart is buyer-specific (unique buyer ID per cart document)
- Orders are vendor-specific (one order per vendor per order session)
- Order IDs are unique using timestamp + random string
- All timestamps are stored in UTC
- Buyer email is validated through Clerk authentication
