import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Input,
} from "@mui/material";
import { styled } from "@mui/system";

import { Product } from "@backend/domains/products/types";
import { useGetProducts } from "./api/hooks/useGetProducts";
import { useCreatePayment } from "./api/hooks/useCreatePayment";

const PricingContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  margin: "0 auto",
}));

const PlanPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
}));

const PlanTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const PlanPrice = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: "bold",
}));

function App() {
  const [quantity, setQuantity] = React.useState(1);
  const { isPending, data: products } = useGetProducts();
  const { mutate } = useCreatePayment();

  const handleOnBuyMonthlyClick = (product: Product) => {
    mutate({ quantity: 1, billingPeriod: product.billingPeriod });
  };

  const handleOnBuyYearlyClick = (product: Product) => {
    mutate({ quantity: 1, billingPeriod: product.billingPeriod });
  };

  const handleOnBuyTeamsClick = (product: Product) => {
    mutate({ quantity, billingPeriod: product.billingPeriod });
  };

  if (isPending) return "Loading...";

  const monthlyProduct = products.monthly;
  const yearlyProduct = products.yearly;
  const teamsProduct = products.teams;

  return (
    <PricingContainer>
      <Typography variant="h3" align="center" gutterBottom>
        Pricing Plans
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Choose the plan that suits you best.
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <PlanPaper elevation={3}>
            <PlanTitle variant="h5">Monthly</PlanTitle>
            <PlanPrice variant="h4">
              {monthlyProduct.price}€ / {monthlyProduct.billingPeriod}
            </PlanPrice>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOnBuyMonthlyClick(monthlyProduct)}
            >
              Buy
            </Button>
          </PlanPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <PlanPaper elevation={3}>
            <PlanTitle variant="h5">Yearly</PlanTitle>
            <PlanPrice variant="h4">
              {yearlyProduct.price}€ / {yearlyProduct.billingPeriod}
            </PlanPrice>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOnBuyYearlyClick(yearlyProduct)}
            >
              Buy
            </Button>
          </PlanPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <PlanPaper elevation={3}>
            <PlanTitle variant="h5">Teams</PlanTitle>
            <PlanPrice variant="h4">
              {teamsProduct.price}€ / {teamsProduct.billingPeriod}
            </PlanPrice>
            <Input
              type="number"
              inputProps={{ min: 1 }}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOnBuyTeamsClick(teamsProduct)}
            >
              Buy
            </Button>
          </PlanPaper>
        </Grid>
      </Grid>
    </PricingContainer>
  );
}

export default App;
