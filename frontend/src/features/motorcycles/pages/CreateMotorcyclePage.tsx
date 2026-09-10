import { Container, Typography, Paper, Box, Stepper, Step, StepLabel } from '@mui/material';
import { useState } from 'react';

const steps = ['Photos', 'Informations', 'Prix', 'Localisation', 'Description', 'Prévisualisation'];

export default function CreateMotorcyclePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Publier une moto
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            Étape {activeStep + 1} : {steps[activeStep]}
          </Typography>
          <Typography color="text.secondary">
            Formulaire à implémenter pour l'étape "{steps[activeStep]}".
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
