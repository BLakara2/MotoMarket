import { useState } from 'react';
import { Container, Typography, Paper, Box, Stepper, Step, StepLabel, ToggleButton, ToggleButtonGroup, TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TwoWheeler as MotoIcon, Build as PartIcon, Checkroom as AccessoryIcon } from '@mui/icons-material';

const steps = ['Type', 'Photos', 'Informations', 'Prix', 'Localisation', 'Description', 'Prévisualisation'];

const PART_CATEGORIES = [
  'Moteur', 'Freins', 'Pneus', 'Échappement', 'Carénage',
  'Électronique', 'Suspension', 'Transmission', 'Éclairage', 'Carrosserie', 'Autre'
];

const ACCESSORY_CATEGORIES = [
  'Casque', 'Blouson', 'Pantalon', 'Gants', 'Bottes',
  'Protections', 'Sacoche', 'Top case', 'Valise', 'Accessoire GPS', 'Autre'
];

const MOTORCYCLE_TYPES = [
  'CROSS', 'ROUTE', 'ROADSTER', 'SCOOTER', 'TRAIL', 'CUSTOM', 'AUTRE'
];

const FUEL_TYPES = [
  'ESSENCE', 'DIELECTRIQUE', 'HYBRIDE', 'ELECTRIQUE'
];

const TRANSMISSION_TYPES = [
  'MANUELLE', 'AUTOMATIQUE', 'SEMI_AUTO'
];

const CONDITION_TYPES = [
  'NEUF', 'TRES_BON', 'BON', 'USAGE', 'A_REFORMER'
];

export default function CreateListingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [listingType, setListingType] = useState<'MOTORCYCLE' | 'PART' | 'ACCESSORY'>('MOTORCYCLE');

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: string | null) => {
    if (newType) setListingType(newType as typeof listingType);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Que voulez-vous vendre ?
            </Typography>
            <ToggleButtonGroup
              value={listingType}
              exclusive
              onChange={handleTypeChange}
              fullWidth
              sx={{ maxWidth: 600 }}
            >
              <ToggleButton value="MOTORCYCLE" sx={{ flexDirection: 'column', py: 3 }}>
                <MotoIcon sx={{ mb: 1 }} />
                Moto
              </ToggleButton>
              <ToggleButton value="PART" sx={{ flexDirection: 'column', py: 3 }}>
                <PartIcon sx={{ mb: 1 }} />
                Pièce détachée
              </ToggleButton>
              <ToggleButton value="ACCESSORY" sx={{ flexDirection: 'column', py: 3 }}>
                <AccessoryIcon sx={{ mb: 1 }} />
                Accessoire
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ajoutez vos photos
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Minimum 3 photos, maximum 15. Formats : JPG, JPEG, PNG, WebP.
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'grey.400',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.50' },
              }}
            >
              <Typography color="text.secondary">
                Glissez vos photos ici ou cliquez pour sélectionner
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Informations sur {listingType === 'MOTORCYCLE' ? 'la moto' : listingType === 'PART' ? 'la pièce' : "l'accessoire"}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField label="Titre" fullWidth required />
              </Grid>

              {listingType === 'MOTORCYCLE' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Marque</InputLabel>
                      <Select label="Marque">
                        <MenuItem value="">Sélectionner</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Modèle</InputLabel>
                      <Select label="Modèle">
                        <MenuItem value="">Sélectionner</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Année" type="number" fullWidth required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Cylindrée (cc)" type="number" fullWidth required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Kilométrage" type="number" fullWidth required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Type de moto</InputLabel>
                      <Select label="Type de moto">
                        {MOTORCYCLE_TYPES.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Carburant</InputLabel>
                      <Select label="Carburant">
                        {FUEL_TYPES.map((f) => (
                          <MenuItem key={f} value={f}>{f}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Transmission</InputLabel>
                      <Select label="Transmission">
                        {TRANSMISSION_TYPES.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {listingType === 'PART' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Catégorie de pièce</InputLabel>
                      <Select label="Catégorie de pièce">
                        {PART_CATEGORIES.map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Marques compatibles" fullWidth placeholder="Ex: Honda, Yamaha, Kymco" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Référence" fullWidth />
                  </Grid>
                </>
              )}

              {listingType === 'ACCESSORY' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Catégorie</InputLabel>
                      <Select label="Catégorie">
                        {ACCESSORY_CATEGORIES.map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Marque" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Taille" fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Couleur" fullWidth />
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>État</InputLabel>
                  <Select label="État">
                    {CONDITION_TYPES.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Prix
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Prix (Ar)" type="number" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Prix négociable</InputLabel>
                  <Select label="Prix négociable" defaultValue="non">
                    <MenuItem value="oui">Oui</MenuItem>
                    <MenuItem value="non">Non</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Localisation
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Ville" fullWidth required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Quartier (optionnel)" fullWidth />
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              L'adresse exacte ne sera pas rendue publique.
            </Typography>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <TextField
              label="Description"
              multiline
              rows={6}
              fullWidth
              required
              placeholder="Décrivez votre article en détail..."
              sx={{ mb: 2 }}
            />

            {listingType === 'MOTORCYCLE' && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="État mécanique" multiline rows={2} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="État esthétique" multiline rows={2} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Entretien" multiline rows={2} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="Papiers disponibles" multiline rows={2} fullWidth />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Modifications" multiline rows={2} fullWidth />
                </Grid>
              </Grid>
            )}
          </Box>
        );

      case 6:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Prévisualisation
            </Typography>
            <Typography color="text.secondary">
              Voici comment votre annonce apparaîtra aux acheteurs.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Publier une annonce
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
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Retour
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep === steps.length - 1 ? (
              <>
                <Button variant="outlined">Enregistrer brouillon</Button>
                <Button variant="contained">Publier</Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setActiveStep((prev) => prev + 1)}>
                Suivant
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
