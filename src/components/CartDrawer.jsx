import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";

const COLORS = {
  primary: "#8B4513",
  accent: "#faad59",
  accentDark: "#e9af73",
  error: "#e45444",
  cardBg: "#fff",
};

function CakeFallbackIcon() {
  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 2,
        bgcolor: "#fae5d7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        color: COLORS.accent,
      }}
    >
      🎂
    </Box>
  );
}

export default function CartDrawer({ cart, setCart, open, onClose }) {
  const [commentMap, setCommentMap] = useState({});

  useEffect(() => {
    setCommentMap(
      cart.reduce((acc, item) => {
        acc[item.id] = item.comment || "";
        return acc;
      }, {})
    );
  }, [cart]);

  const handleCommentChange = (id, comment) => {
    setCommentMap((prev) => ({ ...prev, [id]: comment }));
    setCart(cart.map((item) => (item.id === id ? { ...item, comment } : item)));
  };

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: 370 },
            bgcolor: COLORS.cardBg,
            borderRadius: { xs: 0, sm: 4 },
            boxShadow: "0 8px 24px rgba(139,69,19,0.18)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
          },
        }}
        sx={{
          zIndex: 2000,
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            minHeight: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 800 }}>
              My Requests
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: COLORS.primary, bgcolor: "#fae5d7", borderRadius: 2 }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Scrollable Cart Items List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              minHeight: 0,
            }}
          >
            {cart.length === 0 ? (
              <Typography sx={{ color: COLORS.primary, mt: 3, fontWeight: 600 }}>
                No items added yet.
              </Typography>
            ) : (
              <List disablePadding>
                {cart.map((item) => (
                  <ListItem
                    key={item.id}
                    alignItems="flex-start"
                    sx={{
                      p: { xs: 1, sm: 2 },
                      bgcolor: "rgba(250,229,215,0.15)",
                      borderRadius: 3,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      {item.image_url?.[0] ? (
                        <Avatar
                          variant="rounded"
                          src={item.image_url[0]}
                          alt={item.title}
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: "rgb(145 78 32)",
                          }}
                        />
                      ) : (
                        <CakeFallbackIcon />
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: "bold", color: COLORS.primary }}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <TextField
                            label="Comment"
                            size="small"
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={commentMap[item.id] || ""}
                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                            fullWidth
                            sx={{
                              mt: 1,
                              bgcolor: "#fff8e7",
                              "& .MuiInputBase-root": { borderRadius: 2 },
                            }}
                            placeholder="Add comments or preferences"
                            variant="outlined"
                            InputLabelProps={{
                              sx: { color: COLORS.primary },
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            sx={{
                              mt: 1,
                              textTransform: "none",
                              fontWeight: 700,
                              bgcolor: "#fdecec",
                              color: COLORS.error,
                              borderRadius: 2,
                              "&:hover": { bgcolor: "#ffeae4", color: COLORS.error },
                            }}
                            onClick={() => handleRemove(item.id)}
                          >
                            Remove
                          </Button>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer Buttons */}
          <Box sx={{ flexShrink: 0 }}>
            <Divider sx={{ my: 2, bgcolor: COLORS.accent }} />

            <Button
              variant="outlined"
              color="error"
              fullWidth
              disabled={cart.length === 0}
              sx={{
                mb: 2,
                fontWeight: 700,
                borderRadius: 2,
              }}
              onClick={() => setCart([])}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={cart.length === 0}
              sx={{
                bgcolor: COLORS.accent,
                color: "#fff",
                fontWeight: 800,
                borderRadius: 2,
                boxShadow: "0 4px 12px #faad5922",
                "&:hover:not(:disabled)": { bgcolor: COLORS.accentDark },
              }}
              onClick={() => {
                onClose();
                window.localStorage.removeItem("myRequestsCart");
                window.localStorage.removeItem("cake_cart");
                window.localStorage.setItem("cake_cart", JSON.stringify(cart));
                window.location.href = "/choose-cake/contact-us";
              }}
            >
              Contact Us Request
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
