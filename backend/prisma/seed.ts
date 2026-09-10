import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PASSWORD = 'MotoMarket2026!';
const DAY = 24 * 60 * 60 * 1000;

async function main() {
  console.log('⏳ Reset des tables…');
  await prisma.boost.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.boostPlan.deleteMany();
  await prisma.accessoryCategory.deleteMany();
  await prisma.partCategory.deleteMany();
  await prisma.motorcycleModel.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('👥 Création des utilisateurs…');
  const hash = await bcrypt.hash(PASSWORD, 10);
  const users = await Promise.all(
    [
      {
        firstName: 'Rado', lastName: 'Andrianarisoa', email: 'rado@motomarket.mg',
        phone: '+261 34 12 345 67', role: 'USER' as const, isVerifiedSeller: true,
        profile: { type: 'PROFESSIONAL' as const, businessName: 'Moto Garage Tana', city: 'Antananarivo', district: 'Analamanga', description: 'Garage familial — vente & entretien moto et scooter depuis 2008.' },
      },
      {
        firstName: 'Mialy', lastName: 'Rakoto', email: 'mialy@motomarket.mg',
        phone: '+261 33 56 789 01', role: 'USER' as const, isVerifiedSeller: true,
        profile: { type: 'INDIVIDUAL' as const, city: 'Antsirabe', district: 'Vakinankaratra' },
      },
      {
        firstName: 'Tiana', lastName: 'Randria', email: 'tiana@motomarket.mg',
        phone: '+261 32 34 567 89', role: 'USER' as const, isVerifiedSeller: true,
        profile: { type: 'PROFESSIONAL' as const, businessName: 'Tana Scooter Import', city: 'Antananarivo', district: 'Analamanga', description: 'Importateur officiel Kymco & SYM.' },
      },
      {
        firstName: 'Lova', lastName: 'Rabe', email: 'lova@motomarket.mg',
        phone: '+261 34 98 765 43', role: 'USER' as const, isVerifiedSeller: false,
        profile: { type: 'INDIVIDUAL' as const, city: 'Toamasina', district: 'Atsinanana' },
      },
      {
        firstName: 'Naina', lastName: 'Andriamiarantsoa', email: 'naina@motomarket.mg',
        phone: '+261 33 21 098 76', role: 'USER' as const, isVerifiedSeller: true,
        profile: { type: 'PROFESSIONAL' as const, businessName: 'Kawasaki Madagascar', city: 'Antananarivo', district: 'Analamanga', description: 'Concession Kawasaki — motos et pièces d’origine.' },
      },
      {
        firstName: 'Hery', lastName: 'Ramaroson', email: 'hery@motomarket.mg',
        phone: '+261 32 87 654 32', role: 'USER' as const, isVerifiedSeller: false,
        profile: { type: 'INDIVIDUAL' as const, city: 'Mahajanga', district: 'Boeny' },
      },
      {
        firstName: 'Soa', lastName: 'Rasoa', email: 'soa@motomarket.mg',
        phone: '+261 34 56 123 78', role: 'USER' as const, isVerifiedSeller: false,
        profile: { type: 'INDIVIDUAL' as const, city: 'Fianarantsoa', district: 'Haute Matsiatra' },
      },
      {
        firstName: 'Admin', lastName: 'MotoMarket', email: 'admin@motomarket.mg',
        phone: '+261 34 11 223 34', role: 'ADMIN' as const, isVerifiedSeller: false,
        profile: { type: 'INDIVIDUAL' as const, city: 'Antananarivo', district: 'Analamanga' },
      },
    ].map((u) =>
      prisma.user.create({
        data: {
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          passwordHash: hash,
          role: u.role,
          isEmailVerified: true,
          isPhoneVerified: true,
          isVerifiedSeller: u.isVerifiedSeller,
          verificationStatus: 'VERIFIED',
          sellerProfile: { create: u.profile },
        },
      })
    )
  );
  const [rado, mialy, tiana, lova, naina, hery, soa, admin] = users;

  console.log('🏷️  Marques & modèles…');
  const brands: Record<string, string[]> = {
    Yamaha: ['NMAX 155', 'Aerox 155', 'MT-07', 'XSR125', 'Crypton 110'],
    Kawasaki: ['Ninja 400', 'Z900', 'ZZR250'],
    Kymco: ['Agility 125', 'Xciting 400', 'Like 150'],
    Honda: ['PCX 125', 'CB 125F', 'XR 150L', 'Wave 110'],
    Suzuki: ['Burgman 400', 'Address 110'],
    Vespa: ['Primavera 125', 'GTS 300'],
    'KTM': ['Duke 200', '390 Adventure'],
    SYM: ['Jet 14 125'],
  };
  const brandRecords: Record<string, { id: string }> = {};
  for (const [name, models] of Object.entries(brands)) {
    const brand = await prisma.brand.create({
      data: {
        name,
        motorcycleModels: {
          create: models.map((m) => ({ name: m })),
        },
      },
    });
    brandRecords[name] = brand;
  }
  const modelId = async (brandName: string, modelName: string) =>
    (
      await prisma.motorcycleModel.findFirstOrThrow({
        where: { brandId: brandRecords[brandName].id, name: modelName },
      })
    ).id;

  console.log('📦 Catégories pièces & accessoires…');
  const partCategoryNames = [
    'Pneus', 'Batteries', 'Freins', 'Chaînes et kits', 'Éclairage', 'Filtres', 'Échappements', 'Pièces moteur',
  ];
  const partCategories: Record<string, string> = {};
  for (const name of partCategoryNames) {
    const cat = await prisma.partCategory.create({
      data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
    });
    partCategories[name] = cat.id;
  }

  const accessoryCategoryNames = [
    'Casques', 'Gants', 'Blousons et vestes', 'Bottes et chaussures', 'Antivols', 'Équipement pluie', 'Bagagerie',
  ];
  const accessoryCategories: Record<string, string> = {};
  for (const name of accessoryCategoryNames) {
    const cat = await prisma.accessoryCategory.create({
      data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
    });
    accessoryCategories[name] = cat.id;
  }

  console.log('📋 Plans boost & abonnement…');
  const boostPlans: Record<string, string> = {};
  for (const plan of [
    { name: 'Boost 7 jours', durationDays: 7, price: 15000 },
    { name: 'Boost 30 jours', durationDays: 30, price: 40000 },
  ]) {
    const p = await prisma.boostPlan.create({ data: plan });
    boostPlans[plan.name] = p.id;
  }
  const subscriptionPlans: Record<string, string> = {};
  for (const plan of [
    { name: 'Pro', price: 50000, durationDays: 30, maxActiveListings: 50, maxBoosts: 5, features: ['Badge Pro', '10 photos', 'Boost prioritaire'] },
    { name: 'Gratuit', price: 0, durationDays: 30, maxActiveListings: 5, maxBoosts: 0, features: ['3 photos', 'Annonces illimitées'] },
  ]) {
    const p = await prisma.subscriptionPlan.create({ data: plan });
    subscriptionPlans[plan.name] = p.id;
  }

  console.log('🛵 Création des annonces…');

  type ListingInput = {
    seller: typeof rado;
    title: string;
    description: string;
    price: number;
    negotiable?: boolean;
    condition: 'NEUF' | 'TRES_BON' | 'BON' | 'USAGE';
    city: string;
    district?: string;
    brandLike: 'motorcycle' | 'part' | 'accessory';
    data: {
      toto?: never;
      motorcycle?: { brand: string; model: string; category: 'CROSS' | 'ROUTE' | 'ROADSTER' | 'SCOOTER' | 'TRAIL'; year: number; mileage?: number; engineCc: number; fuel: 'ESSENCE' | 'ELECTRIQUE'; transmission: 'MANUELLE' | 'AUTOMATIQUE' | 'SEMI_AUTO'; maintenanceInfo?: string; papersInfo?: string; modifications?: string };
      part?: { category: string; compatibleBrands?: string; reference: string };
      accessory?: { category: string; size?: string; color: string; accessoryBrand: string };
    };
    featured?: boolean;
    views?: number;
  };

  const listingsData: ListingInput[] = [
    // ── MotoS & Scooters ──
    { seller: tiana, title: 'Kymco Agility 125 — 2020, 12 000 km', description: 'Scooter en très bon état, entretien à jour dans notre atelier. Pneus neufs, batterie neuve, carte grise à jour. Idéal pour la ville.', price: 4800000, negotiable: true, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Kymco', model: 'Agility 125', category: 'SCOOTER', year: 2020, mileage: 12000, engineCc: 125, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE', maintenanceInfo: 'Révisions tous les 3000 km', papersInfo: 'Carte grise + assurance à jour', modifications: 'Rétroviseurs chromés' } }, featured: true, views: 342 },
    { seller: tiana, title: 'SYM Jet 14 125 — 2021', description: 'Petit gabarit, grande fiabilité. Parfait premier scooter. Démarrage électrique, top-case offert.', price: 5250000, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'SYM', model: 'Jet 14 125', category: 'SCOOTER', year: 2021, mileage: 9500, engineCc: 125, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE' } }, views: 187 },
    { seller: rado, title: 'Yamaha NMAX 155 — 2022 ABS', description: 'Le roi du trafic tanais ! 155cc, ABS, effet traction avant. Vendue avec coffre, top-case et GPS de série. Facture et entretiens disponibles.', price: 9500000, negotiable: true, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Yamaha', model: 'NMAX 155', category: 'SCOOTER', year: 2022, mileage: 8000, engineCc: 155, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE', modifications: 'Top-case Yamaha, poignées chauffantes' } }, featured: true, views: 521 },
    { seller: tiana, title: 'Kymco Xciting 400 — maxi-scooter', description: 'Maxi-scooter confortable pour les longues distances. Double disque, bac 2 casques, entretien complet effectué.', price: 13500000, negotiable: true, condition: 'BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Kymco', model: 'Xciting 400', category: 'SCOOTER', year: 2018, mileage: 22000, engineCc: 400, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE' } }, views: 156 },
    { seller: lova, title: 'Honda PCX 125 — 2019', description: 'Vendue pour cause de départ à l’étranger. Entretien chez Honda, ~10 000 km. Une petite rayure sur le plastique gauche.', price: 6900000, negotiable: true, condition: 'BON', city: 'Toamasina', district: 'Atsinanana', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Honda', model: 'PCX 125', category: 'SCOOTER', year: 2019, mileage: 10000, engineCc: 125, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE', papersInfo: 'Carte grise à jour' } }, views: 263 },
    { seller: mialy, title: 'Vespa Primavera 125 — épicurienne', description: 'La légende italienne. Moteur propre, belle peinture. Entretenue par un passionné. Souvenirs de vadrouilles garantis.', price: 11000000, negotiable: true, condition: 'TRES_BON', city: 'Antsirabe', district: 'Vakinankaratra', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Vespa', model: 'Primavera 125', category: 'SCOOTER', year: 2020, mileage: 14000, engineCc: 125, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE' } }, featured: true, views: 410 },
    { seller: naina, title: 'Kawasaki Ninja 400 — sportive', description: 'Roadster sportif en parfait état. 45 cv, freinage ABS. Entretien en concession Kawasaki uniquement. Pneus à 80%.', price: 18500000, negotiable: true, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Kawasaki', model: 'Ninja 400', category: 'ROUTE', year: 2019, mileage: 9800, engineCc: 400, fuel: 'ESSENCE', transmission: 'MANUELLE', maintenanceInfo: 'Vidanges toutes les 5000 km', papersInfo: 'Carte grise + assurance', modifications: 'Compteurs Koso' } }, featured: true, views: 638 },
    { seller: rado, title: 'Yamaha MT-07 — 2021', description: 'Le fameux roadster universel. Moteur CP2 increvable, selle confort, très bon état général. Belle occasion.', price: 24000000, negotiable: true, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Yamaha', model: 'MT-07', category: 'ROADSTER', year: 2021, mileage: 15000, engineCc: 689, fuel: 'ESSENCE', transmission: 'MANUELLE' } }, views: 289 },
    { seller: rado, title: 'Yamaha Aerox 155 — sport scooter', description: 'Look sport, échappement racing, réactif. Vendu avec antivol et casque.', price: 7200000, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Yamaha', model: 'Aerox 155', category: 'SCOOTER', year: 2021, mileage: 11000, engineCc: 155, fuel: 'ESSENCE', transmission: 'AUTOMATIQUE', modifications: 'Échappement racing' } }, views: 198 },
    { seller: hery, title: 'KTM Duke 200 — trail urbain', description: 'Agile, léger, parfait pour la ville et les routes de Mahajanga. Neuf peu servi.', price: 7900000, condition: 'USAGE', city: 'Mahajanga', district: 'Boeny', brandLike: 'motorcycle', data: { motorcycle: { brand: 'KTM', model: 'Duke 200', category: 'TRAIL', year: 2017, mileage: 21000, engineCc: 199, fuel: 'ESSENCE', transmission: 'MANUELLE' } }, views: 134 },
    { seller: naina, title: 'Kawasaki ZZR250 — classique', description: 'Petite sportive intemporelle, moteur souple. Idéale pour débuter. Quelques marques d’usage mais mécanique saine.', price: 5800000, condition: 'USAGE', city: 'Antananarivo', district: 'Analamanga', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Kawasaki', model: 'ZZR250', category: 'ROUTE', year: 2012, mileage: 38000, engineCc: 250, fuel: 'ESSENCE', transmission: 'MANUELLE' } }, views: 112 },
    { seller: soa, title: 'Honda XR 150L — trail/cross léger', description: 'Fiable, simple et increvable. Idéal campagne et école. Facile à vendre, entretien minimal.', price: 6100000, condition: 'TRES_BON', city: 'Fianarantsoa', district: 'Haute Matsiatra', brandLike: 'motorcycle', data: { motorcycle: { brand: 'Honda', model: 'XR 150L', category: 'TRAIL', year: 2020, mileage: 13000, engineCc: 150, fuel: 'ESSENCE', transmission: 'MANUELLE' } }, views: 176 },

    // ── Pièces ──
    { seller: rado, title: 'Pneu avant 110/70-17 (Yamaha/Kymco)', description: 'Pneu tubeless neuf, fabrication 2024. Compatible NMAX 155, Agility 125, Aerox 155 et équivalents.', price: 85000, condition: 'NEUF', city: 'Antananarivo', district: 'Analamanga', brandLike: 'part', data: { part: { category: 'Pneus', compatibleBrands: 'Yamaha, Kymco, SYM, Honda', reference: 'PN-110/70-17' } }, views: 208 },
    { seller: rado, title: 'Batterie YTX7L-BS (scooters 125)', description: 'Batterie gel, prête à l’emploi. Compatible Agility 125, PCX 125, NMAX 155.', price: 95000, negotiable: true, condition: 'NEUF', city: 'Antananarivo', district: 'Analamanga', brandLike: 'part', data: { part: { category: 'Batteries', compatibleBrands: 'Kymco, Honda, Yamaha', reference: 'BT-YTX7L' } }, views: 145 },
    { seller: rado, title: 'Kit chaîne + pignon (Ninja 400 / ZZR250)', description: 'Kit d’origine Kawasaki, longue durée. Fourni avec joint de boîte.', price: 130000, condition: 'NEUF', city: 'Antananarivo', district: 'Analamanga', brandLike: 'part', data: { part: { category: 'Chaînes et kits', compatibleBrands: 'Kawasaki', reference: 'CH-KIT-520' } }, views: 96 },
    { seller: tiana, title: 'Disque de frein AV (Kymco Agility 125)', description: 'Disque d’origine, Ø 190mm. Vendu avec vis.', price: 60000, condition: 'NEUF', city: 'Antananarivo', district: 'Analamanga', brandLike: 'part', data: { part: { category: 'Freins', compatibleBrands: 'Kymco', reference: 'FR-D190' } }, views: 88 },
    { seller: tiana, title: 'Ampoule LED H4 blanc (2200lm)', description: 'Système complet temps réel, compatibilité universelle 12V. Éclairage blanc froid.', price: 45000, condition: 'NEUF', city: 'Antananarivo', district: 'Analamanga', brandLike: 'part', data: { part: { category: 'Éclairage', compatibleBrands: 'Universel', reference: 'EC-LED-H4' } }, views: 121 },
    { seller: naina, title: 'Échappement Akrapovič — Ninja 400', description: 'Échappement d’origine Kawasaki/Akrapovič, son grave et profond. Homologué.', price: 580000, negotiable: true, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'part', data: { part: { category: 'Échappements', compatibleBrands: 'Kawasaki', reference: 'EC-AKR-400' } }, views: 75 },

    // ── Accessoires ──
    { seller: mialy, title: 'Casque intégral Shark Skwal 2 — XL', description: 'Casque homologué ECE 22.06, taillé XL, visière fumée incluse. Très peu porté.', price: 350000, negotiable: true, condition: 'TRES_BON', city: 'Antsirabe', district: 'Vakinankaratra', brandLike: 'accessory', data: { accessory: { category: 'Casques', size: 'XL', color: 'Noir mat', accessoryBrand: 'Shark' } }, featured: true, views: 233 },
    { seller: mialy, title: 'Gants cuir Dainese — L', description: 'Gants cuir perforé, protection noquets. Confort été.', price: 220000, condition: 'TRES_BON', city: 'Antsirabe', district: 'Vakinankaratra', brandLike: 'accessory', data: { accessory: { category: 'Gants', size: 'L', color: 'Noir', accessoryBrand: 'Dainese' } }, views: 164 },
    { seller: rado, title: 'Blouson cuir vintage — M/L', description: 'Blouson motard cuir véritable, doublure amovible. Style café racer.', price: 650000, negotiable: true, condition: 'BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'accessory', data: { accessory: { category: 'Blousons et vestes', size: 'L', color: 'Marron', accessoryBrand: 'Furygan' } }, views: 118 },
    { seller: rado, title: 'Bottes cross — taille 42', description: 'Bottes de cross renforcées, pratiquement neuves. Rigidité latérale, boucles alu.', price: 480000, condition: 'TRES_BON', city: 'Antananarivo', district: 'Analamanga', brandLike: 'accessory', data: { accessory: { category: 'Bottes et chaussures', size: '42', color: 'Noir/Rouge', accessoryBrand: 'Alpinestars' } }, views: 92 },
    { seller: soa, title: 'Antivol pliant Kryptonite — série 600', description: 'Antivol pliant certifié, 6 maillons. Très résistant, avec étui.', price: 180000, condition: 'NEUF', city: 'Fianarantsoa', district: 'Haute Matsiatra', brandLike: 'accessory', data: { accessory: { category: 'Antivols', color: 'Gris', accessoryBrand: 'Kryptonite' } }, views: 147 },
    { seller: lova, title: 'Bagagerie top-case 46L — amovible', description: 'Top-case 46L avec dossier, montage universel (1h en atelier). Sécurisé par clé.', price: 250000, negotiable: true, condition: 'TRES_BON', city: 'Toamasina', district: 'Atsinanana', brandLike: 'accessory', data: { accessory: { category: 'Bagagerie', size: '46L', color: 'Noir', accessoryBrand: 'Givi' } }, views: 130 },
  ];

  const now = new Date();
  let index = 0;
  for (const item of listingsData) {
    const common = {
      sellerId: item.seller.id,
      type: item.brandLike === 'motorcycle' ? 'MOTORCYCLE' as const : item.brandLike === 'part' ? 'PART' as const : 'ACCESSORY' as const,
      title: item.title,
      description: item.description,
      price: item.price,
      isPriceNegotiable: item.negotiable ?? false,
      condition: item.condition,
      city: item.city,
      district: item.district ?? null,
      status: 'ACTIVE' as const,
      isFeatured: item.featured ?? false,
      publishedAt: new Date(now.getTime() - (20 + index * 13) * DAY),
      expiresAt: new Date(now.getTime() + 90 * DAY),
      viewsCount: item.views ?? 50 + index * 37,
      ...(item.data.motorcycle && {
        brandId: brandRecords[item.data.motorcycle.brand].id,
        modelId: await modelId(item.data.motorcycle.brand, item.data.motorcycle.model),
        motorcycleCategory: item.data.motorcycle.category,
        year: item.data.motorcycle.year,
        mileage: item.data.motorcycle.mileage ?? null,
        engineCc: item.data.motorcycle.engineCc,
        fuel: item.data.motorcycle.fuel,
        transmission: item.data.motorcycle.transmission,
        maintenanceInfo: item.data.motorcycle.maintenanceInfo ?? null,
        papersInfo: item.data.motorcycle.papersInfo ?? null,
        modifications: item.data.motorcycle.modifications ?? null,
      }),
      ...(item.data.part && {
        partCategoryId: partCategories[item.data.part.category],
        compatibleBrands: item.data.part.compatibleBrands ?? null,
        partReference: item.data.part.reference,
      }),
      ...(item.data.accessory && {
        accessoryCategoryId: accessoryCategories[item.data.accessory.category],
        accessorySize: item.data.accessory.size ?? null,
        accessoryColor: item.data.accessory.color,
        accessoryBrand: item.data.accessory.accessoryBrand,
      }),
    };

    const listing = await prisma.listing.create({
      data: common as never,
    });

    if (item.featured) {
      await prisma.boost.create({
        data: {
          listingId: listing.id,
          userId: item.seller.id,
          planId: boostPlans['Boost 30 jours'],
          startsAt: listing.publishedAt!,
          endsAt: new Date(listing.publishedAt!.getTime() + 30 * DAY),
          status: 'ACTIVE',
        },
      });
      await prisma.payment.create({
        data: {
          userId: item.seller.id,
          type: 'BOOST',
          amount: 40000,
          currency: 'MGA',
          provider: 'PAYPAL',
          providerReference: `SEED-BOOST-${index}`,
          status: 'COMPLETED',
        },
      });
    }
    index += 1;
  }

  console.log('💬 Quelques favorites, avis et conversations…');
  const topListing = await prisma.listing.findFirst({ where: { isFeatured: true }, orderBy: { viewsCount: 'desc' } });
  if (topListing) {
    await prisma.favorite.create({ data: { userId: hery.id, listingId: topListing.id } });
    await prisma.review.create({
      data: {
        reviewerId: soa.id,
        sellerId: topListing.sellerId,
        listingId: topListing.id,
        rating: 5,
        comment: 'Vendeur sérieux, annonce conforme, transaction rapide.',
      },
    });
    await prisma.review.create({
      data: {
        reviewerId: hery.id,
        sellerId: topListing.sellerId,
        listingId: topListing.id,
        rating: 4,
        comment: 'Très bonne communication, livraison à Mahajanga possible.',
      },
    });
  }

  const soldCount = await prisma.listing.count({ where: { type: 'MOTORCYCLE' } });
  const partCount = await prisma.listing.count({ where: { type: 'PART' } });
  const accCount = await prisma.listing.count({ where: { type: 'ACCESSORY' } });
  console.log(`✅ Seed terminé — ${soldCount} motos/scooters, ${partCount} pièces, ${accCount} accessoires.`);
  console.log(`🔑 Mot de passe de démonstration pour tous les comptes : ${PASSWORD}`);
  console.log(`   admin@motomarket.mg / rado@motomarket.mg / mialy@motomarket.mg / tiana@motomarket.mg …`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });