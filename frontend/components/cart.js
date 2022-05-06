import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardBody, CardTitle, Badge } from "reactstrap";
import AppContext from "./context"
import Link from "next/link"


// we can pass cart data in via props method 
// the alternative is using useContext as below
function Cart() {
  
  let isAuthenticated = false;
  let { user, cart, addItem, removeItem, orderStatus } = useContext(AppContext);
  //const [cartA, setCartA] = useState({cart})
  //cart = value.cart;
  //console.log('props:'+ JSON.stringify(value));
  //console.log(`in CART: ${JSON.stringify(cart)}`)

  //   problem is that cart may not be set
  const router = useRouter();
  //console.log(`Router Path: ${JSON.stringify(router)}`)
  const renderItems = () => {
    let items = []
    if (cart) {
      items = cart.items;
    }
   // console.log(`cccccccccccccccitems: ${JSON.stringify(items)}`)
    if (items && items.length) {
      var itemList = cart.items.map((item) => {
        if (item.quantity > 0) {
          return (
            <div
              className="items-one"
              style={{ marginBottom: 15 }}
              key={item.id}
            >
              <div>
                <span id="item-price">&nbsp; ${item.price}</span>
                <span id="item-name">&nbsp; {item.name}</span>
              </div>
              <div>
                <Button
                  style={{
                    height: 25,
                    padding: 0,
                    width: 15,
                    marginRight: 5,
                    marginLeft: 10,
                  }}
                  onClick={() => addItem(item)}
                  color="link"
                >
                  +
                </Button>
                <Button
                  style={{
                    height: 25,
                    padding: 0,
                    width: 15,
                    marginRight: 10,
                  }}
                  onClick={() => removeItem(item)}
                  color="link"
                >
                  -
                </Button>
                <span style={{ marginLeft: 5 }} id="item-quantity">
                  {item.quantity}x
                </span>
              </div>
            </div>
          );
        }
      })
      return itemList;
    }
    else {
      return (<div></div>)
    }
  }
  const checkoutItems = () => {
    return (
      <div>
        <Badge style={{ width: 200, paddingRight: 150 }} color="white">
          <h6 style={{ fontWeight: 100, color: "black" }}>Total:</h6>
          <h4>${cart ? cart.total : 0}</h4>
        </Badge>

        {router.pathname !== '/checkout' ? (     
            < Link href="/checkout/">
              <Button style={{ width: "30%" }} color="info">
                <a>Order</a>
              </Button>
            </Link>) : null
        }
      </div>
    )
  }

  // return Cart
  return (
    <div>
      <h4> Cart</h4>
      <Card style={{ padding: "10px 5px" }} className="cart">
        <CardTitle style={{ margin: 10 }}><strong>Your Cart:</strong></CardTitle>
        <hr />
        <CardBody style={{ padding: 10 }}>
          <div style={{ marginBottom: 6 }}>
            <strong>Items:</strong>
          </div>
          <div>
            {orderStatus != true ?  renderItems() : <></>}
          </div>
          <div>
            {orderStatus != true ? checkoutItems() : <></>}
          </div>

          {/* {console.log(`Router Path: ${router.asPath}`)} */}
        </CardBody>
      </Card>
      <style jsx>{`
        #item-price {
          font-size: 1.3em;
          color: rgba(97, 97, 97, 1);
        }
        #item-quantity {
          font-size: 0.95em;
          padding-bottom: 4px;
          color: rgba(158, 158, 158, 1);
        }
        #item-name {
          font-size: 1.3em;
          color: rgba(97, 97, 97, 1);
        }
      `}</style>
    </div>
  );
}
export default Cart;
