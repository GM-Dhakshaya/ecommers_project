import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // Add search-related state
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const navigate = useNavigate();


    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');


    const addToCart = async(id, size = '') => {
        // Check if it's a clothing item and size is not selected
        const product = products.find(item => item.id === id);
        if (product && (product.category === 'Men' || product.category === 'Women' || product.category === 'Kids') && !size) {
            toast.error('Please select a size before adding to cart');
            return;
        }

        let cartData = structuredClone(cartItems);
        
        // Create unique key for the item (id + size for clothing, just id for others)
        const itemKey = size ? `${id}_${size}` : id;
        
        if (cartData[itemKey]) {
            // Item already exists, increment quantity
            cartData[itemKey].quantity += 1;
            toast.success('Item quantity updated in cart!');
        } else {
            // Add new item to cart
            if (product) {
                cartData[itemKey] = {
                    id: id,
                    name: product.name,
                    price: product.price,
                    image: product.image[0],
                    size: size,
                    quantity: 1
                };
                toast.success('Item added to cart!');
            }
        }
        
        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));

        if(token){
            try{
                const response = await axios.post(backendUrl+'/api/cart/add',{itemId: id,size}, {headers:{token}});
                if(response.data.success){
                    // Update frontend cart with backend data to stay in sync
                    setCartItems(response.data.cartData);
                    localStorage.setItem('cartItems', JSON.stringify(response.data.cartData));
                }
            }catch(error){
                console.log(error);
                toast.error('Error adding to cart');
            }
        }
    };
    const getCartCount = () => {
        let totalCount = 0;
        for (const itemKey in cartItems) {
            if (cartItems[itemKey] && cartItems[itemKey].quantity) {
                totalCount += cartItems[itemKey].quantity;
            }
        }
        return totalCount;
    };
    const updateQuantity = async(id, size = '', quantity) => {
        let cartData = structuredClone(cartItems);
        const itemKey = size ? `${id}_${size}` : id;
        
        if (quantity === 0) {
            delete cartData[itemKey];
            toast.success('Item removed from cart!');
        } else if (cartData[itemKey]) {
            cartData[itemKey].quantity = quantity;
            toast.success('Quantity updated!');
        }
        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));
        
        // Then sync with backend
        if(token){
            try{
                const response = await axios.post(backendUrl+'/api/cart/update',{itemId: id,size,quantity}, {headers:{token}});
                if(response.data.success){
                    setCartItems(response.data.cartData);
                    localStorage.setItem('cartItems', JSON.stringify(response.data.cartData));
                }
            }catch(error){
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = useCallback(() => {
        let totalAmount = 0;
        
        for (const itemKey in cartItems) {
            if (cartItems[itemKey] && cartItems[itemKey].quantity > 0) {
                // Use the price directly from cart item instead of looking up in products
                const price = Number(cartItems[itemKey].price);
                const quantity = Number(cartItems[itemKey].quantity);
                
                if (!isNaN(price) && !isNaN(quantity)) {
                    totalAmount += price * quantity;
                }
            }
        }
        return totalAmount;
    }, [cartItems]);

    const getUserCart = async()=>{
        try{
            const response = await axios.post(backendUrl+'/api/cart/get',{}, {headers:{token}});
            if(response.data.success){
                setCartItems(response.data.cartData);
                localStorage.setItem('cartItems', JSON.stringify(response.data.cartData));
            }
        }catch(error){
            console.log( error);
            toast.error(error.message);
        }
    }

    const getProductsData = async()=>{
        try{
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.products);
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            console.log(error);
            toast.error('Error fetching products');
        }
    }

    const refreshCartFromBackend = async() => {
        if(token){
            await getUserCart(token);
        }
    }




    useEffect(()=>{
        getProductsData();
    },[]);


    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    },[])



    useEffect(()=>{
        if(token){
            getUserCart(token);
        } else {
            // If no token, load from localStorage as fallback
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
    },[token])




    // // Refresh cart when token changes
    // useEffect(()=>{
    //     if(token){
    //         getUserCart(token);
    //     }
    // },[token])




    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        refreshCartFromBackend
    };
    
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export { ShopContext };
export default ShopContextProvider;

