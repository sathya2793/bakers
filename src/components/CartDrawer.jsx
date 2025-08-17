import {
  Drawer, Box, Typography, IconButton, TextField, Button, Divider,
  List, ListItem, ListItemText, ListItemAvatar, Avatar
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from 'react';
//import CheckoutDialog from "./CheckoutDialog"; // you will create this

export default function CartDrawer({ cart, setCart, open, onClose }) {
  const [commentMap, setCommentMap] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    setCommentMap(() => cart.reduce((acc, item) => {
      acc[item.id] = item.comment || "";
      return acc;
    }, {}));
  }, [cart]);

  const handleCommentChange = (id, comment) => {
    setCommentMap(prev => ({ ...prev, [id]: comment }));
    setCart(cart.map(item => item.id === id ? { ...item, comment } : item));
  };

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 370, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Your Cart</Typography>
            <IconButton onClick={onClose}><Close /></IconButton>
          </Box>
          {cart.length === 0 ? (
            <Typography>No items added yet.</Typography>
          ) : (
            <List>
              {cart.map(item => (
                <ListItem key={item.id} alignItems="flex-start" sx={{ mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar src={item.image_url?.[0]} variant="rounded" />
                  </ListItemAvatar>
                  <ListItemText primary={item.title} secondary={
                    <>
                      <TextField
                        label="Comment"
                        size="small"
                        value={commentMap[item.id] || ""}
                        onChange={e => handleCommentChange(item.id, e.target.value)}
                        fullWidth sx={{ mt: 1 }}
                        placeholder="Add comments or preferences"
                        variant="outlined"
                      />
                      <Button size="small" color="error" sx={{ mt: 1 }} onClick={() => handleRemove(item.id)}>
                        Remove
                      </Button>
                    </>
                  } />
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={cart.length === 0}
            onClick={() => setCheckoutOpen(true)}
          >Checkout</Button>
        </Box>
      </Drawer>
      {/* <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
      /> */}
    </>
  );
}