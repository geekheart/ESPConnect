<template>
  <v-expand-transition>
    <div v-if="details" class="device-info-wrapper">
      <v-card class="device-card" elevation="0" variant="flat">
        <v-card-text class="device-card__body">
          <div class="device-header">
            <v-avatar class="device-avatar" size="68">
              <v-icon size="38">mdi-chip</v-icon>
            </v-avatar>
            <div class="device-header__text">
              <div class="device-chip-name">{{ details.description || details.name }}</div>
              <div v-if="hasDistinctDescription" class="device-chip-alias">
                {{ details.name }}
              </div>
              <div
                v-if="revisionLabel || details.mac"
                class="device-chip-subline"
              >
                <span v-if="revisionLabel" class="device-chip-subline-item">
                  <v-icon size="20">mdi-update</v-icon>
                  {{ revisionLabel }}
                </span>
                <span v-if="details.mac" class="device-chip-subline-item">
                  <v-icon size="20">mdi-wifi</v-icon>
                  {{ details.mac }}
                </span>
              </div>
            </div>
          </div>

      <v-row class="device-highlights" dense>
        <v-col cols="12" md="6">
          <v-card class="highlight-card highlight-card--flash" elevation="0" variant="flat">
            <v-card-text class="highlight-card__body">
              <div class="highlight-card__icon">
                <v-icon size="34">mdi-memory</v-icon>
              </div>
              <div class="highlight-card__content">
                <div class="highlight-card__label">Flash & Clock</div>
                <div class="highlight-card__value">
                  {{ details.flashSize || 'Capacity Unknown' }}
                </div>
                <div v-if="details.crystal" class="highlight-card__meta">
                  Crystal {{ details.crystal }}
                </div>
              </div>
            </v-card-text>
            <v-card-text v-if="primaryFacts.length" class="highlight-card__footer">
              <div
                v-for="fact in primaryFacts"
                :key="fact.label"
                class="highlight-card__fact"
              >
                <v-icon size="18">{{ fact.icon || 'mdi-information-outline' }}</v-icon>
                <span>{{ fact.value }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="highlight-card highlight-card--features" elevation="0" variant="flat">
            <v-card-text class="highlight-card__body">
              <div class="highlight-card__icon">
                <v-icon size="34">mdi-lightning-bolt-outline</v-icon>
              </div>
              <div class="highlight-card__content">
                <div class="highlight-card__label">Feature Set</div>
                <div class="highlight-card__value">
                  {{ hasFeatures ? `${details.features.length} capabilities` : 'No features reported' }}
                </div>
                <div v-if="details.mac" class="highlight-card__meta">
                  MAC {{ details.mac }}
                </div>
              </div>
            </v-card-text>
            <v-card-text class="highlight-card__chips">
              <template v-if="hasFeatures">
                <v-chip
                  v-for="feature in featurePreview"
                  :key="feature"
                  class="feature-chip"
                  variant="flat"
                  size="small"
                >
                  <v-icon size="16" start>mdi-check-circle</v-icon>
                  {{ feature }}
                </v-chip>
                <v-chip
                  v-if="details.features.length > featurePreview.length"
                  class="feature-chip feature-chip--more"
                  size="small"
                  variant="outlined"
                >
                  +{{ details.features.length - featurePreview.length }} more
                </v-chip>
              </template>
              <div v-else class="highlight-card__empty">
                <v-icon size="18">mdi-eye-off-outline</v-icon>
                <span>Device did not report any optional capabilities.</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

          <div v-if="details.factGroups?.length" class="detail-groups">
            <div class="section-title mb-3">
              <v-icon size="18" class="me-2">mdi-chip</v-icon>
              Hardware Details
            </div>
            <v-row dense class="detail-group-row">
              <v-col
                v-for="group in details.factGroups"
                :key="group.title"
                cols="12"
                md="6"
              >
                <v-card class="detail-card" elevation="0" variant="tonal">
                  <v-card-title class="detail-card__title">
                    <v-icon size="18" class="me-2">{{ group.icon }}</v-icon>
                    {{ group.title }}
                  </v-card-title>
                  <v-divider class="detail-card__divider" />
                  <v-card-text class="detail-card__body">
                    <div
                      v-for="fact in group.items"
                      :key="fact.label"
                      class="detail-card__item"
                    >
                      <div class="detail-card__item-label">
                        <v-icon v-if="fact.icon" size="16" class="me-2">{{ fact.icon }}</v-icon>
                        <span>{{ fact.label }}</span>
                      </div>
                      <div class="detail-card__item-value">{{ fact.value }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-expand-transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  chipDetails: {
    type: Object,
    default: null,
  },
});

const details = computed(() => {
  const candidate = props.chipDetails;
  if (candidate && typeof candidate === 'object' && 'value' in candidate && !Array.isArray(candidate)) {
    return candidate.value ?? null;
  }
  return candidate ?? null;
});

const revisionLabel = computed(() => {
  const facts = details.value?.facts;
  if (!Array.isArray(facts)) return null;
  return facts.find(fact => fact.label === 'Revision')?.value ?? null;
});

const hasDistinctDescription = computed(() => {
  if (!details.value) return false;
  const { name, description } = details.value;
  return Boolean(description) && description !== name;
});

const primaryFacts = computed(() => {
  const facts = Array.isArray(details.value?.facts) ? details.value.facts : [];
  if (!facts.length) return [];
  const preferredOrder = [
    'Embedded Flash',
    'Embedded PSRAM',
    'Flash Device',
    'Connection Baud',
    'USB Bridge',
  ];
  const selected = [];
  const seen = new Set();

  for (const label of preferredOrder) {
    const match = facts.find(fact => fact.label === label && fact.value);
    if (match && !seen.has(match.label)) {
      selected.push(match);
      seen.add(match.label);
    }
    if (selected.length >= 3) break;
  }

  if (selected.length < 3) {
    for (const fact of facts) {
      if (fact?.value && !seen.has(fact.label)) {
        selected.push(fact);
        seen.add(fact.label);
        if (selected.length >= 3) break;
      }
    }
  }

  return selected;
});

const hasFeatures = computed(
  () => Array.isArray(details.value?.features) && details.value.features.length > 0
);

const featurePreview = computed(() => {
  if (!hasFeatures.value) return [];
  const limit = 6;
  return details.value.features.slice(0, limit);
});

</script>

<style scoped>
.device-info-wrapper {
  position: relative;
}

.device-card {
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--v-theme-primary) 18%, transparent) 0%,
    color-mix(in srgb, var(--v-theme-surface) 95%, transparent) 100%
  );
  border: 1px solid color-mix(in srgb, var(--v-theme-primary) 16%, transparent);
  overflow: hidden;
}

.device-card__body {
  padding: clamp(20px, 4vw, 36px);
}

.device-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.device-avatar {
  background: color-mix(in srgb, var(--v-theme-primary) 28%, transparent);
  color: color-mix(in srgb, var(--v-theme-primary) 85%, var(--v-theme-on-surface) 50%);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
}

.device-header__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device-chip-name {
  font-size: clamp(1.8rem, 3.8vw, 2.4rem);
  font-weight: 680;
  letter-spacing: 0.012em;
  color: color-mix(in srgb, var(--v-theme-on-surface) 98%, transparent);
}

.device-chip-alias {
  font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  color: color-mix(in srgb, var(--v-theme-on-surface) 64%, transparent);
}

.device-chip-subline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-top: 10px;
  font-size: clamp(1.05rem, 2.4vw, 1.25rem);
  font-weight: 600;
  letter-spacing: 0.015em;
  color: color-mix(in srgb, var(--v-theme-on-surface) 86%, transparent);
}

.device-chip-subline-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.device-chip-subline-item :deep(.v-icon) {
  color: inherit;
  opacity: 0.95;
}

.device-highlights {
  margin-bottom: clamp(18px, 3vw, 32px);
}

.highlight-card {
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--v-theme-primary) 16%, transparent);
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--v-theme-surface) 92%, transparent) 0%,
    color-mix(in srgb, var(--v-theme-primary) 12%, transparent) 100%
  );
  position: relative;
  overflow: hidden;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14);
}

.highlight-card--flash {
  background: linear-gradient(
      140deg,
      color-mix(in srgb, var(--v-theme-primary) 22%, transparent) 0%,
      color-mix(in srgb, var(--v-theme-surface) 96%, transparent) 100%
    ),
    linear-gradient(140deg, rgba(255, 255, 255, 0.08), transparent);
}

.highlight-card--features {
  background: linear-gradient(
      140deg,
      color-mix(in srgb, var(--v-theme-secondary) 24%, transparent) 0%,
      color-mix(in srgb, var(--v-theme-surface) 96%, transparent) 100%
    ),
    linear-gradient(140deg, rgba(255, 255, 255, 0.04), transparent);
}

.highlight-card__body {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: clamp(20px, 4vw, 32px);
  min-height: 160px;
}

.highlight-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--v-theme-primary) 42%, transparent);
  color: color-mix(in srgb, var(--v-theme-on-primary) 95%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--v-theme-on-primary) 18%, transparent);
}

.highlight-card--features .highlight-card__icon {
  background: color-mix(in srgb, var(--v-theme-secondary) 46%, transparent);
  color: color-mix(in srgb, var(--v-theme-on-secondary) 94%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--v-theme-on-secondary) 20%, transparent);
}

.highlight-card__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: color-mix(in srgb, var(--v-theme-on-surface) 96%, transparent);
}

.highlight-card__label {
  text-transform: uppercase;
  font-size: 0.76rem;
  letter-spacing: 0.16em;
  font-weight: 600;
  opacity: 0.82;
}

.highlight-card__value {
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  font-weight: 700;
  letter-spacing: 0.01em;
}

.highlight-card__meta {
  font-size: 0.9rem;
  opacity: 0.8;
}

.highlight-card__footer,
.highlight-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 clamp(20px, 4vw, 28px) clamp(18px, 3vw, 26px);
}

.highlight-card__fact {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--v-theme-primary) 26%, transparent);
  color: color-mix(in srgb, var(--v-theme-on-primary) 94%, transparent);
  font-size: 0.87rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--v-theme-on-primary) 18%, transparent);
}

.highlight-card--features .highlight-card__chips {
  background: color-mix(in srgb, var(--v-theme-secondary) 18%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--v-theme-on-secondary) 14%, transparent);
}

.highlight-card__empty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--v-theme-on-secondary) 85%, transparent);
  opacity: 0.92;
}

.section-title {
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--v-theme-on-surface) 80%, transparent);
  margin-bottom: 12px;
}

.feature-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.feature-chip {
  border-radius: 999px;
  background: color-mix(in srgb, var(--v-theme-on-secondary) 12%, transparent) !important;
  color: color-mix(in srgb, var(--v-theme-on-secondary) 96%, transparent) !important;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--v-theme-on-secondary) 22%, transparent);
  backdrop-filter: blur(4px);
}

.feature-chip--more {
  background: transparent !important;
  color: color-mix(in srgb, var(--v-theme-on-secondary) 82%, transparent) !important;
  border-color: color-mix(in srgb, var(--v-theme-on-secondary) 40%, transparent) !important;
}

.feature-chip :deep(.v-icon) {
  color: inherit;
  opacity: 0.9;
}

.detail-groups {
  margin-top: 28px;
}

.detail-group-row {
  margin-bottom: -12px;
}

.detail-card {
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, var(--v-theme-primary) 12%, transparent);
  background: linear-gradient(
      150deg,
      color-mix(in srgb, var(--v-theme-surface) 98%, transparent) 0%,
      color-mix(in srgb, var(--v-theme-primary) 10%, transparent) 100%
    ),
    linear-gradient(150deg, rgba(255, 255, 255, 0.04), transparent);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-card__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 650;
  color: color-mix(in srgb, var(--v-theme-on-surface) 94%, transparent);
  padding: 20px 24px 14px;
  letter-spacing: 0.015em;
}

.detail-card__divider {
  margin: 0 22px;
  opacity: 0.35;
}

.detail-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 24px 24px;
}

.detail-card__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px 18px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.detail-card__item-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: color-mix(in srgb, var(--v-theme-on-surface) 80%, transparent);
  font-size: 0.87rem;
  letter-spacing: 0.01em;
}

.detail-card__item-value {
  font-weight: 650;
  font-size: 0.92rem;
  color: color-mix(in srgb, var(--v-theme-on-surface) 98%, transparent);
  text-align: right;
  word-break: break-word;
}

@media (max-width: 959px) {
  .detail-group-row {
    margin-bottom: 0;
  }
}

@media (max-width: 599px) {
  .detail-card__item {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .detail-card__item-value {
    text-align: left;
  }
}
</style>
