/**
 * ============================================================
 * INNOVATION - SISTEMA DE SCROLL
 * ============================================================
 *
 * Esta sección utiliza un único MotionValue de scroll
 * (`parentProgress`) para sincronizar dos sistemas visuales:
 *
 * 1. BACKGROUND
 *    Innovation.Container
 *    └── useMaskImage()
 *        └── mask-image + scale
 *
 * 2. CENTRAL CARD
 *    ClipImageCard
 *    ├── AnimatedMaskText
 *    │   └── anima número, título y descripción
 *    │
 *    └── ClipImageContainer
 *        └── clip-path + scale de las imágenes
 *
 *
 * FLUJO:
 *
 * scroll
 *   ↓
 * parentProgress (0 → 1)
 *   │
 *   ├──→ Innovation.Container
 *   │       ↓
 *   │   localScrollYProgress
 *   │       ↓
 *   │   useMaskImage
 *   │       ↓
 *   │   background image reveal
 *   │
 *   └──→ ClipImageCard
 *           ↓
 *       currentState (1 → 5)
 *           │
 *           ├──→ AnimatedMaskText
 *           │       └── texto
 *           │
 *           └──→ ClipImageContainer
 *                   └── imagen de la tarjeta
 *
 *
 * Las mismas imágenes se utilizan dos veces:
 *
 * - Una vez como imágenes grandes de fondo.
 * - Una vez dentro de la tarjeta central.
 *
 * Cada representación tiene una animación diferente,
 * pero ambas están sincronizadas mediante el mismo
 * scrollYProgress.
 * ============================================================
 */

                        SCROLL
                           │
                           ▼
                  ┌─────────────────┐
                  │ parentProgress  │
                  │      0 → 1      │
                  └────────┬────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      BACKGROUND SYSTEM             CARD SYSTEM
             │                           │
             ▼                           ▼
 Innovation.Container            ClipImageCard
             │                           │
             ▼                           ▼
 localScrollYProgress             currentState
             │                    1 → 2 → 3 → 4 → 5
             ▼                           │
       useMaskImage              ┌───────┴───────┐
             │                    │               │
             ▼                    ▼               ▼
       mask-image             MaskText      ClipImageContainer
             │                    │               │
             ▼                    ▼               ▼
       background               texto          clip-path
        reveal                                  +
             │                                  scale
             ▼                                    │
        background                               ▼
          image                               card image