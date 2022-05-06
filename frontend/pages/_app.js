import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import AppContext from "../components/context";
import Home from "./index"
import Layout from "../components/layout"
import Cookie from "js-cookie"
import { useRouter } from "next/router";
import Router from "next/router";

function MyApp(props){

  const router = useRouter();
  let {cart, setCart, user, setUser, addItem, removeItem, orderStatus, setOrderStatus} = useContext(AppContext)
  const [state,setState] = useState(null)
  const { Component, pageProps } = props;
  const [order, setOrder] = useState(false)
  
  
  setUser = (user) => {
    setState(user);
  };  

  // setCart = (c) => {
  //   state.cart=c
  //   setUser(user)
  // };  

  setOrderStatus = (tORf) => {
  setOrder(tORf);
  }; 

  addItem = async (item) => {
    
    var newCart={}
    setOrderStatus(false);

    if (state == null) {
      router.push("/login");
      return;
    }
    let { items } = state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    let foundItem = true;
    if(items.length > 0){
      foundItem = items.find((i) => i.id === item.id);
     
      if(!foundItem) foundItem = false;
    }
    else{
      foundItem = false;
    }
    console.log(`Found Item value: ${JSON.stringify(foundItem)}`)
    // if item is not new, add to cart, set quantity to 1
    if (!foundItem) {
      //set quantity property to 1
    
      let temp = JSON.parse(JSON.stringify(item));
      temp.quantity = 1;
      newCart = {
          items: [...state.cart.items,temp],
          total: state.cart.total + item.price,
          id: state.cart.id
      }
    } else {
      // we already have it so just increase quantity ++
      console.log(`Total so far:  ${state.cart.total}`)
      newCart= {
          items: items.map((item) =>{
            if(item.id === foundItem.id){
              return Object.assign({}, item, { quantity: item.quantity + 1 })
             }else{
               return item;
             }
          }),
          total: state.cart.total + item.price,
          id: state.cart.id
      }
    }
    setState({cart: newCart});
    let varCart = newCart
    // setCart(varCart) 
    await cartInfo(varCart) 
  };


  removeItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    const foundItem = items.find((i) => i.id === item.id);
    if (foundItem.quantity > 1) {
      var newCart = {
        items: items.map((item) =>{
        if(item.id === foundItem.id){
          return Object.assign({}, item, { quantity: item.quantity - 1 })
         }else{
        return item;
      }}),
      total: state.cart.total - item.price,
      id: state.cart.id
      }
      //console.log(`NewCart after remove: ${JSON.stringify(newCart)}`)
    } else { // only 1 in the cart so remove the whole item
      //console.log(`Try remove item ${JSON.stringify(foundItem)}`)
      const index = items.findIndex((i) => i.id === foundItem.id);
      items.splice(index, 1);
      var newCart= { items: items, total: state.cart.total - item.price, id: state.cart.id } 
    }
    setState({cart:newCart});
    let varCart = newCart
    //setCart(varCart) 
    cartInfo(varCart) 
  }


  async function cartInfo(varCart) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    const userToken = Cookie.get("token");
    const response = await fetch(`${API_URL}/carts/${state.cart.id}`, {
            method: "PUT",
            headers: userToken && { Authorization: `Bearer ${userToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                user: state.email,
                cartItem: varCart
            }),
          }) 
 }

  return (
    <AppContext.Provider value={{cart: state ? state.cart : null, addItem: addItem, removeItem: removeItem,isAuthenticated:false,
            user:state,setUser:setUser, setOrderStatus:setOrderStatus, orderStatus:order}}>
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
    
      <Layout>
          <Component {...pageProps} />
      </Layout>

    </AppContext.Provider>
  );
  
}


export default MyApp;
