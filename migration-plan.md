# Service and Model Migration Plan

## Overview
This document outlines the plan to consolidate all services and models in the core directory and eliminate duplicates.

## Migration Status

### Already Migrated
- ✅ User model and service
- ✅ Product model and service
- ✅ Stock model and service
- ✅ Auth service (already in core)
- ✅ Event model and service

### To Be Migrated
- ⏳ Delivery model and service
- ⏳ Collecte model and service
- ⏳ Reclamation model and service
- ⏳ Scrap model and service
- ⏳ Inspection model and service
- ⏳ Food Quality model and service

## Implementation Steps

1. For each service/model pair:
   - Create or update the model in `src/app/core/models`
   - Create or update the service in `src/app/core/services`
   - Ensure imports reference the core models

2. After all migrations are complete:
   - Delete the duplicate models in `src/app/models`
   - Delete the duplicate services in `src/app/services`

3. Update any imports throughout the application to reference the core models and services

## Consolidation Command (to be run after migration is complete)
```bash
# Delete duplicate models
rm -rf src/app/models/*.model.ts

# Delete duplicate services
rm -rf src/app/services/*.service.ts
```

## Validation Step
After migration, verify that:
1. All necessary models and services are in the core directory
2. No functionality has been lost
3. The application builds and runs correctly 